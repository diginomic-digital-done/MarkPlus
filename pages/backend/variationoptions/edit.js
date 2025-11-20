import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../dashboard/layout';

export default function EditVariationOption() {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({
    type: '',
    label: '',
    description: '',
    image: '',
    priceDelta: '',
    isActive: true,
    order: '',
    floorPlanId: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [floorPlans, setFloorPlans] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFloorPlans() {
      try {
        const response = await fetch('/api/floorplans');
        const data = await response.json();
        setFloorPlans(Array.isArray(data) ? data : []);
      } catch {
        setFloorPlans([]);
      }
    }
    fetchFloorPlans();
  }, []);

  useEffect(() => {
    if (!id) return;
    async function fetchVariationOption() {
      setLoading(true);
      try {
        const response = await fetch(`/api/variationoptions?id=${id}`);
        const data = await response.json();
        setFormData({
          type: data.type || '',
          label: data.label || '',
          description: data.description || '',
          image: data.image || '',
          priceDelta: data.priceDelta || '',
          isActive: data.isActive ?? true,
          order: data.order || '',
          floorPlanId: data.floorPlanId ? String(data.floorPlanId) : '',
        });
      } catch {
        alert('Failed to fetch variation option.');
      }
      setLoading(false);
    }
    fetchVariationOption();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    const newErrors = {};
    if (!formData.type) newErrors.type = 'Type is required.';
    if (!formData.label) newErrors.label = 'Label is required.';
    if (!formData.floorPlanId) newErrors.floorPlanId = 'Floor Plan is required.';
    if (formData.priceDelta && isNaN(Number(formData.priceDelta))) newErrors.priceDelta = 'Price Delta must be a number.';
    if (formData.order && isNaN(Number(formData.order))) newErrors.order = 'Order must be a number.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    let imageUrl = formData.image;
    if (imageFile) {
      const imgForm = new FormData();
      imgForm.append('files', imageFile);
      const res = await fetch('/api/upload', { method: 'POST', body: imgForm });
      const data = await res.json();
      imageUrl = data.files?.[0]?.url || '';
    }

    const submitData = { ...formData, image: imageUrl, id };
    const response = await fetch('/api/variationoptions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData),
    });
    if (response.ok) {
      alert('Variation Option updated successfully!');
      router.push('/backend/variationoptions');
    } else {
      alert('Failed to update Variation Option.');
    }
  };

  if (loading) return <DashboardLayout><div className="p-6">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Edit Variation Option</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
            required
          >
            <option value="">Select Type*</option>
            <option value="COLOR">Color</option>
            <option value="LAYOUT">Layout</option>
            <option value="UPGRADE">Upgrade</option>
          </select>
          {errors.type && <div className="text-red-500 text-sm">{errors.type}</div>}
          <input
            type="text"
            placeholder="Label*"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          {errors.label && <div className="text-red-500 text-sm">{errors.label}</div>}
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files[0])}
              className="border border-gray-300 p-2 rounded w-full"
            />
            {formData.image && !imageFile && (
              <img src={formData.image} alt="Preview" className="mt-2 h-16" />
            )}
          </div>
          <input
            type="number"
            placeholder="Price Delta"
            value={formData.priceDelta}
            onChange={(e) => setFormData({ ...formData, priceDelta: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          {errors.priceDelta && <div className="text-red-500 text-sm">{errors.priceDelta}</div>}
          <div className="flex items-center space-x-2">
            <label className="text-gray-700">Active:</label>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <input
            type="number"
            placeholder="Order"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          {errors.order && <div className="text-red-500 text-sm">{errors.order}</div>}
          <select
            value={formData.floorPlanId}
            onChange={e => setFormData({ ...formData, floorPlanId: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
            required
          >
            <option value="">Select Floor Plan*</option>
            {floorPlans.map(fp => (
              <option key={fp.id} value={fp.id}>{fp.title}</option>
            ))}
          </select>
          {errors.floorPlanId && <div className="text-red-500 text-sm">{errors.floorPlanId}</div>}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Update Variation Option
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
