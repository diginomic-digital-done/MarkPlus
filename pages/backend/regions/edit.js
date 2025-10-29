import { useState, useEffect } from 'react';
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
import { useRouter } from 'next/router';
import DashboardLayout from '../dashboard/layout';

export default function EditRegion() {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    isActive: true,
    pdfStaticPages: [], // array of file URLs
    stateId: '',
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([]);

  useEffect(() => {
    if (id) {
      fetch(`/api/regions/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name || '',
            code: data.code || '',
            isActive: data.isActive ?? true,
            pdfStaticPages: Array.isArray(data.pdfStaticPages) ? data.pdfStaticPages : [],
            stateId: data.stateId ? String(data.stateId) : '',
          });
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    fetch('/api/states')
      .then((res) => res.json())
      .then((data) => setStates(data));
  }, []);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const formDataUpload = new FormData();
    files.forEach((file) => formDataUpload.append('file', file));
    const res = await fetch('/api/regions/upload', {
      method: 'POST',
      body: formDataUpload,
    });
    const data = await res.json();
    setUploading(false);
    if (data.urls) {
      setFormData((prev) => ({
        ...prev,
        pdfStaticPages: [...prev.pdfStaticPages, ...data.urls],
      }));
    }
  };

  const handleRemoveFile = (idx) => {
    setFormData((prev) => ({
      ...prev,
      pdfStaticPages: prev.pdfStaticPages.filter((_, i) => i !== idx),
    }));
  };


  // dnd-kit setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFormData((prev) => {
        const oldIndex = prev.pdfStaticPages.findIndex((_, idx) => idx === active.id);
        const newIndex = prev.pdfStaticPages.findIndex((_, idx) => idx === over.id);
        return {
          ...prev,
          pdfStaticPages: arrayMove(prev.pdfStaticPages, oldIndex, newIndex),
        };
      });
    }
  }

  function SortableItem({ id, url, idx, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      background: isDragging ? '#f3f4f6' : undefined,
    };
    return (
      <li ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center space-x-2 cursor-move">
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">PDF {idx + 1}</a>
        <button type="button" onClick={() => onRemove(idx)} className="text-red-500 px-2">Remove</button>
      </li>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/regions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      alert('Region updated successfully!');
      router.push('/backend/regions');
    } else {
      alert('Failed to update Region.');
    }
  };

  if (loading) return <DashboardLayout><div className="p-6">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Edit Region</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={formData.stateId}
            onChange={e => setFormData({ ...formData, stateId: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
            required
          >
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
          <div className="flex items-center space-x-2">
            <label className="text-gray-700">Active:</label>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">PDF Static Pages (Upload & Order)</label>
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileChange}
              className="border border-gray-300 p-2 rounded w-full"
              disabled={uploading}
            />
            {uploading && <div className="text-blue-500">Uploading...</div>}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={formData.pdfStaticPages.map((_, idx) => idx)} strategy={verticalListSortingStrategy}>
                <ul className="mt-2 space-y-2">
                  {formData.pdfStaticPages.map((url, idx) => (
                    <SortableItem key={idx} id={idx} url={url} idx={idx} onRemove={handleRemoveFile} />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Update Region
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
