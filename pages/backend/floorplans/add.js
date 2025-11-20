// Drag-and-drop upload zone component
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import DashboardLayout from "../dashboard/layout";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function UploadZone({ label, accept, multiple, onFiles, previews, type }) {
  const inputRef = useRef();
  const [localPreviews, setLocalPreviews] = useState([]);
  const [localPdfNames, setLocalPdfNames] = useState([]);
  // Helper to get correct preview URL
  const getPreviewUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("data:")) return url; // Local preview
    if (url.startsWith("http") || url.startsWith("/")) return url;
    return `/uploads/${url}`;
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => accept.includes(f.type.split("/")[0]) || accept.includes(f.type)
    );
    if (files.length === 0) return alert("Invalid file type.");
    // Show local previews for images
    if (type === "image") {
      const readers = files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      );
      const previews = await Promise.all(readers);
      setLocalPreviews(previews);
    }
    // Upload files to /api/upload
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setLocalPreviews([]); // Clear local previews after upload
    onFiles(data.files.map((f) => f.url));
  };
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current.click()}
      >
        <input
          type="file"
          accept={accept.join(",")}
          multiple={multiple}
          style={{ display: "none" }}
          ref={inputRef}
          onChange={async (e) => {
            const files = Array.from(e.target.files);
            if (type === "image") {
              const readers = files.map(
                (file) =>
                  new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                  })
              );
              const previews = await Promise.all(readers);
              setLocalPreviews(previews);
              setLocalPdfNames([]);
            } else if (type === "pdf") {
              setLocalPreviews(files.map(() => null));
              setLocalPdfNames(files.map((f) => f.name));
            }
            // Upload files to /api/upload
            const formData = new FormData();
            files.forEach((f) => formData.append("files", f));
            const res = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            setLocalPreviews([]); // Clear local previews after upload
            setLocalPdfNames([]);
            onFiles(data.files.map((f) => f.url));
          }}
        />
        <span className="text-gray-500">
          Drag & drop or click to select {label.toLowerCase()}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        {/* Show local previews first if present */}
        {localPreviews.length > 0
          ? localPreviews.map((url, idx) => (
              <div key={idx} className="relative group">
                {type === "image" ? (
                  <img
                    src={url}
                    alt="Preview"
                    className="h-20 w-20 rounded-md shadow-md"
                  />
                ) : (
                  <span className="inline-flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">PDF</span>
                    {/* Show filename for local PDF */}
                    {type === "pdf" && (
                      <span className="ml-2 text-xs text-gray-500">{label} {idx + 1}</span>
                    )}
                  </span>
                )}
                {/* Remove icon for local preview (allow cancel before upload) */}
                <button
                  className="absolute top-0 right-0 px-2 py-1 text-xs text-white bg-red-500 rounded-md opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocalPreviews(localPreviews.filter((_, i) => i !== idx));
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          : previews.map((url, idx) => (
              <div key={url} className="relative group">
                {type === "image" ? (
                  <img
                    src={getPreviewUrl(url)}
                    alt="Preview"
                    className="h-20 w-20 rounded-md shadow-md"
                  />
                ) : (
                  <span className="inline-flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">PDF</span>
                    {/* Show filename for PDF */}
                    {type === "pdf" && (
                      <span className="ml-2 text-xs text-gray-500">{url.split("/").pop()}</span>
                    )}
                  </span>
                )}
                <button
                  className="absolute top-0 right-0 px-2 py-1 text-xs text-white bg-red-500 rounded-md opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Remove for both single and multiple
                    onFiles(previews.filter((_, i) => i !== idx));
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
      </div>
    </div>
  );
}

export default function AddFloorPlan() {
  // dnd-kit sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const [formData, setFormData] = useState({
    title: "",
    regionId: "",
    frontage: "",
    areaLiving: "",
    areaTotal: "",
    basePrice: "",
    heroImage: "",
    gallery: [],
    brochurePdf: "",
    floorPlanUrl: "",
    status: "Active",
    pdfPagesOverride: [],
    bedrooms: "",
    bathrooms: "",
    carSpaces: "",
  });
  const [heroImagePreview, setHeroImagePreview] = useState(null); // State for hero image preview
  const [galleryPreviews, setGalleryPreviews] = useState([]); // State for gallery image previews
  const [active, setActive] = useState(true); // State for active checkbox
  const [regions, setRegions] = useState([]); // State for regions
  const [heroImageError, setHeroImageError] = useState(""); // State for hero image error

  // Drag-and-drop for PDF override pages
  function handlePdfOverrideDragEnd(event) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = formData.pdfPagesOverride.findIndex(
        (id) => id === active.id
      );
      const newIndex = formData.pdfPagesOverride.findIndex(
        (id) => id === over.id
      );
      setFormData((prev) => ({
        ...prev,
        pdfPagesOverride: arrayMove(prev.pdfPagesOverride, oldIndex, newIndex),
      }));
    }
  }
  useEffect(() => {
    async function fetchRegions() {
      try {
        const response = await axios.get("/api/regions");
        setRegions(response.data);
      } catch (error) {
        setRegions([]);
      }
    }
    fetchRegions();
  }, []);

  const handleDropGallery = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          const preview = reader.result;
          if (!galleryPreviews.includes(preview)) {
            // Prevent duplicate images
            setGalleryPreviews((prev) => [...prev, preview]);
          } else {
            alert("This image is already in the gallery.");
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please upload valid image files.");
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submit triggered');
console.log('Form submit triggered');
console.log('Current heroImagePreview:', heroImagePreview);
console.log('Current regionId:', formData.regionId);
    // Validate hero image
    if (!heroImagePreview) {
      setHeroImageError("Please select a hero image.");
      return;
    } else {
      setHeroImageError(""); // Clear error if hero image is valid
    }

    // Validate region
    const regionId = parseInt(formData.regionId, 10);
    if (!formData.regionId || isNaN(regionId)) {
      alert("Please select a valid region.");
      return;
    }

    const submitData = {
      ...formData,
      regionId,
      frontage: parseFloat(formData.frontage) || null,
      areaLiving: parseInt(formData.areaLiving) || null,
      areaTotal: parseInt(formData.areaTotal) || null,
      basePrice: parseFloat(formData.basePrice) || 0.0,
      heroImage: heroImagePreview || null,
      gallery: galleryPreviews || [],
      status: formData.status,
    };
    console.log('Form data:', submitData);

    try {
      const response = await axios.post("/api/floorplans", submitData);
      alert("Floor Plan created successfully!");
    } catch (error) {
      alert(
        `Failed to create Floor Plan: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  const handleRemoveGalleryItem = (index) => {
    setGallery((prevGallery) => prevGallery.filter((_, i) => i !== index));
    setGalleryPreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  const handleRemovePdfPage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      pdfPagesOverride: prevData.pdfPagesOverride.filter((_, i) => i !== index),
    }));
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="form-container bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-bold mb-4">Add New Floor Plan</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title of the Floor Plan</label>
              <input
                type="text"
                name="title"
                id="title"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                id="bedrooms"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
                value={formData.bedrooms}
                onChange={e => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                id="bathrooms"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
                value={formData.bathrooms}
                onChange={e => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="carSpaces" className="block text-sm font-medium text-gray-700">Car Spaces</label>
              <input
                type="number"
                name="carSpaces"
                id="carSpaces"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
                value={formData.carSpaces}
                onChange={e => setFormData(prev => ({ ...prev, carSpaces: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="regionId"
                className="block text-sm font-medium text-gray-700"
              >
                Region
              </label>
              <select
                name="regionId"
                id="regionId"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
                value={formData.regionId}
                onChange={e => setFormData(prev => ({ ...prev, regionId: e.target.value }))}
              >
                <option value="">Select a region</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label
                htmlFor="frontage"
                className="block text-sm font-medium text-gray-700"
              >
                Frontage
              </label>
              <input
                type="number"
                name="frontage"
                id="frontage"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
                value={formData.frontage}
                onChange={e => setFormData(prev => ({ ...prev, frontage: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="areaLiving"
                className="block text-sm font-medium text-gray-700"
              >
                Area Living
              </label>
              <input
                type="number"
                name="areaLiving"
                id="areaLiving"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
                value={formData.areaLiving}
                onChange={e => setFormData(prev => ({ ...prev, areaLiving: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="areaTotal"
                className="block text-sm font-medium text-gray-700"
              >
                Area Total
              </label>
              <input
                type="number"
                name="areaTotal"
                id="areaTotal"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
                value={formData.areaTotal}
                onChange={e => setFormData(prev => ({ ...prev, areaTotal: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="basePrice"
                className="block text-sm font-medium text-gray-700"
              >
                Base Price
              </label>
              <input
                type="number"
                name="basePrice"
                id="basePrice"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
                value={formData.basePrice}
                onChange={e => setFormData(prev => ({ ...prev, basePrice: e.target.value }))}
              />
            </div>
            <UploadZone
              label="Upload Hero Image"
              accept={["image"]}
              multiple={false}
              onFiles={(urls) => {
                setHeroImagePreview(urls[0] || null);
                setFormData((prev) => ({ ...prev, heroImage: urls[0] || "" }));
              }}
              previews={heroImagePreview ? [heroImagePreview] : []}
              type="image"
            />
            <UploadZone
              label="Upload Gallery Images"
              accept={["image"]}
              multiple={true}
              onFiles={(urls) => {
                setGalleryPreviews(urls);
                setFormData((prev) => ({ ...prev, gallery: urls }));
              }}
              previews={galleryPreviews}
              type="image"
            />
            <UploadZone
              label="Upload Brochure PDF"
              accept={["application/pdf"]}
              multiple={false}
              onFiles={(urls) => {
                setFormData((prev) => ({ ...prev, brochurePdf: urls[0] || "" }));
              }}
              previews={formData.brochurePdf ? [formData.brochurePdf] : []}
              type="pdf"
            />
              {/* PDF Pages Override Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  PDF Pages Override (optional)
                </label>
                <UploadZone
                  label="Upload PDF Pages (Override)"
                  accept={["application/pdf"]}
                  multiple={true}
                  onFiles={(urls) => {
                    setFormData((prev) => ({ ...prev, pdfPagesOverride: urls }));
                  }}
                  previews={formData.pdfPagesOverride}
                  type="pdf"
                />
                {/* Drag-and-drop reordering for PDF override pages */}
                {formData.pdfPagesOverride.length > 0 && (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePdfOverrideDragEnd}>
                    <SortableContext items={formData.pdfPagesOverride} strategy={verticalListSortingStrategy}>
                      <div className="flex flex-col gap-2 mt-2">
                        {formData.pdfPagesOverride.map((url, idx) => (
                          <div key={url} className="flex items-center gap-2 bg-gray-50 p-2 rounded shadow">
                            <span className="inline-flex items-center">
                              <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                              </svg>
                              <span className="text-sm text-gray-700">PDF Page {idx + 1}</span>
                            </span>
                            <button
                              className="ml-auto px-2 py-1 text-xs text-white bg-red-500 rounded-md"
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemovePdfPage(idx);
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  checked={formData.status === "Active"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.checked ? "Active" : "Inactive",
                    }))
                  }
                />
                <span className="ml-2 text-sm text-gray-700">
                  Mark as Active
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600"
            >
              Create Floor Plan
            </button>
          </form>
        </div>
      </div>
  </DashboardLayout>
  )
}