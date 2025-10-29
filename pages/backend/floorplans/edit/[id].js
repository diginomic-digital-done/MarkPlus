import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
  // Drag-and-drop for PDF override pages
  function handlePdfOverrideDragEnd(event) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setPdfPagesOverrideNames((prev) => arrayMove(prev, active.id, over.id));
    }
  }

  function SortablePdfOverrideItem({ id, pdf, idx, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      background: isDragging ? '#f3f4f6' : undefined,
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center space-x-4 cursor-move">
        <span className="text-sm text-gray-700">{pdf}</span>
        <button
          className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
          type="button"
          onClick={() => onRemove(idx)}
        >Remove</button>
      </div>
    );
  }
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../dashboard/layout';

export default function EditFloorPlan() {
  // dnd-kit sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const router = useRouter();
  const { id } = router.query;
  const [floorPlan, setFloorPlan] = useState({
    title: '',
    regionId: '',
    frontage: '',
    areaLiving: '',
    areaTotal: '',
    basePrice: '',
    heroImage: '',
    gallery: [],
    brochurePdf: '',
    floorPlanUrl: '',
    status: 'Active',
    pdfPagesOverride: [],
  });
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [brochurePdfName, setBrochurePdfName] = useState('');
  const [pdfPagesOverrideNames, setPdfPagesOverrideNames] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    if (id) {
      fetch(`/api/floorplans/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFloorPlan(data);
          setHeroImagePreview(data.heroImage || null);
          setGalleryPreviews(data.gallery || []);
          setBrochurePdfName(data.brochurePdf || '');
          setPdfPagesOverrideNames(data.pdfPagesOverride || []);
        })
        .catch((error) => console.error('Error fetching floor plan:', error));
    }
  }, [id]);

  useEffect(() => {
    async function fetchRegions() {
      try {
        const response = await fetch('/api/regions');
        const data = await response.json();
        setRegions(data);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    }
    fetchRegions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare data for submission, converting numeric fields
    const updatedData = {
      ...floorPlan,
      regionId: floorPlan.regionId ? Number(floorPlan.regionId) : undefined,
      frontage: floorPlan.frontage ? Number(floorPlan.frontage) : undefined,
      areaLiving: floorPlan.areaLiving ? Number(floorPlan.areaLiving) : undefined,
      areaTotal: floorPlan.areaTotal ? Number(floorPlan.areaTotal) : undefined,
      basePrice: floorPlan.basePrice ? Number(floorPlan.basePrice) : undefined,
      heroImage: heroImagePreview || floorPlan.heroImage,
      gallery: galleryPreviews.length > 0 ? galleryPreviews : floorPlan.gallery,
      brochurePdf: brochurePdfName || floorPlan.brochurePdf,
      pdfPagesOverride: pdfPagesOverrideNames.length > 0 ? pdfPagesOverrideNames : floorPlan.pdfPagesOverride,
      status: floorPlan.status,
    };
    try {
      const response = await fetch(`/api/floorplans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        alert('Floor plan updated successfully!');
        router.push('/backend/floorplans');
      } else {
        console.error('Error updating floor plan:', response.statusText);
        alert('Error updating floor plan.');
      }
    } catch (error) {
      console.error('Error updating floor plan:', error);
      alert('Error updating floor plan.');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="form-container bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-bold mb-4">Edit Floor Plan</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title of the Floor Plan</label>
              <input
                type="text"
                name="title"
                id="title"
                value={floorPlan.title}
                onChange={(e) => setFloorPlan({ ...floorPlan, title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {/* Region */}
            <div className="form-group">
              <label htmlFor="regionId" className="block text-sm font-medium text-gray-700">Region</label>
              <select
                name="regionId"
                id="regionId"
                value={floorPlan.regionId}
                onChange={(e) => setFloorPlan({ ...floorPlan, regionId: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a region</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>{region.name}</option>
                ))}
              </select>
            </div>
            {/* Frontage */}
            <div className="form-group">
              <label htmlFor="frontage" className="block text-sm font-medium text-gray-700">Frontage</label>
              <input
                type="number"
                name="frontage"
                id="frontage"
                value={floorPlan.frontage}
                onChange={(e) => setFloorPlan({ ...floorPlan, frontage: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {/* Area Living */}
            <div className="form-group">
              <label htmlFor="areaLiving" className="block text-sm font-medium text-gray-700">Area Living</label>
              <input
                type="number"
                name="areaLiving"
                id="areaLiving"
                value={floorPlan.areaLiving}
                onChange={(e) => setFloorPlan({ ...floorPlan, areaLiving: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {/* Area Total */}
            <div className="form-group">
              <label htmlFor="areaTotal" className="block text-sm font-medium text-gray-700">Area Total</label>
              <input
                type="number"
                name="areaTotal"
                id="areaTotal"
                value={floorPlan.areaTotal}
                onChange={(e) => setFloorPlan({ ...floorPlan, areaTotal: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {/* Base Price */}
            <div className="form-group">
              <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">Base Price</label>
              <input
                type="number"
                name="basePrice"
                id="basePrice"
                value={floorPlan.basePrice}
                onChange={(e) => setFloorPlan({ ...floorPlan, basePrice: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {/* Hero Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Upload Hero Image</label>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (!file.type.startsWith('image/')) {
                    alert('Please upload a valid image file.');
                    return;
                  }
                  // Upload to /api/upload
                  const formData = new FormData();
                  formData.append('files', file);
                  const res = await fetch('/api/upload', { method: 'POST', body: formData });
                  const data = await res.json();
                  setHeroImagePreview(data.files[0]?.url || null);
                }}
              />
              {heroImagePreview && (
                <div className="mt-4 flex items-center space-x-4">
                  <img src={heroImagePreview} alt="Hero Image Preview" className="h-20 w-20 rounded-md shadow-md" />
                  <button
                    className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                    onClick={() => setHeroImagePreview(null)}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            {/* Gallery */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Upload Gallery Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={async (e) => {
                  const files = Array.from(e.target.files);
                  let error = '';
                  files.forEach((file) => {
                    if (!file.type.startsWith('image/')) {
                      error = 'All files must be valid images.';
                      return;
                    }
                  });
                  if (error) {
                    alert(error);
                    return;
                  }
                  // Upload all images
                  const formData = new FormData();
                  files.forEach((file) => formData.append('files', file));
                  const res = await fetch('/api/upload', { method: 'POST', body: formData });
                  const data = await res.json();
                  setGalleryPreviews(data.files.map(f => f.url));
                }}
              />
              <div className="mt-4 grid grid-cols-3 gap-4">
                {galleryPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img src={preview} alt={`Gallery Preview ${index}`} className="h-20 w-20 rounded-md shadow-md" />
                    <button
                      className="absolute top-0 right-0 px-2 py-1 text-xs text-white bg-red-500 rounded-md opacity-0 group-hover:opacity-100"
                      onClick={() => setGalleryPreviews((prev) => prev.filter((_, i) => i !== index))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Brochure PDF */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Upload Brochure PDF</label>
              <input
                type="file"
                accept="application/pdf"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (file.type !== 'application/pdf') {
                    alert('Please upload a valid PDF file.');
                    return;
                  }
                  // Upload to /api/upload
                  const formData = new FormData();
                  formData.append('files', file);
                  const res = await fetch('/api/upload', { method: 'POST', body: formData });
                  const data = await res.json();
                  setBrochurePdfName(data.files[0]?.url || '');
                }}
              />
              {brochurePdfName && (
                <div className="mt-4 flex items-center space-x-4">
                  <span className="inline-flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    <span className="text-sm text-gray-700">{brochurePdfName}</span>
                  </span>
                  <button
                    className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                    onClick={() => setBrochurePdfName('')}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            {/* PDF Pages Override */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Upload PDF Pages for Override</label>
              <input
                type="file"
                accept="application/pdf"
                multiple
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={async (e) => {
                  const files = Array.from(e.target.files);
                  let error = '';
                  files.forEach((file) => {
                    if (file.type !== 'application/pdf') {
                      error = 'All files must be valid PDFs.';
                      return;
                    }
                  });
                  if (error) {
                    alert(error);
                    return;
                  }
                  // Upload all PDFs
                  const formData = new FormData();
                  files.forEach((file) => formData.append('files', file));
                  const res = await fetch('/api/upload', { method: 'POST', body: formData });
                  const data = await res.json();
                  setPdfPagesOverrideNames(data.files.map(f => f.url));
                }}
              />
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePdfOverrideDragEnd}>
                <SortableContext items={pdfPagesOverrideNames.map((_, idx) => idx)} strategy={verticalListSortingStrategy}>
                  <div className="mt-4 space-y-2">
                    {pdfPagesOverrideNames.map((pdf, idx) => (
                      <div key={idx} className="flex items-center space-x-4 cursor-move">
                        <span className="inline-flex items-center">
                          <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                          <span className="text-sm text-gray-700">{pdf}</span>
                        </span>
                        <button
                          className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                          type="button"
                          onClick={() => setPdfPagesOverrideNames((prev) => prev.filter((_, j) => j !== idx))}
                        >Remove</button>
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
            {/* Status */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  checked={floorPlan.status === 'Active'}
                  onChange={(e) => setFloorPlan((prev) => ({ ...prev, status: e.target.checked ? 'Active' : 'Inactive' }))}
                />
                <span className="ml-2 text-sm text-gray-700">Mark as Active</span>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}