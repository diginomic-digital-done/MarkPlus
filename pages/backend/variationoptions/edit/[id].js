import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../dashboard/layout';

export default function EditVariationOption() {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({
    variationTypeId: '',
    label: '',
    description: '',
    image: '',
    staffImage: '',
    priceDelta: '',
    staffPriceDelta: '',
    isActive: true,
    order: '',
    floorPlanId: '',
  });
  const [staffImageFile, setStaffImageFile] = useState(null);
  const [variationTypes, setVariationTypes] = useState([]);
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
    async function fetchVariationTypes() {
      try {
        const response = await fetch('/api/variationtypes');
        const data = await response.json();
        setVariationTypes(Array.isArray(data) ? data : []);
      } catch {
        setVariationTypes([]);
      }
    }
    fetchVariationTypes();
  }, []);

  useEffect(() => {
    if (!id) return;
    async function fetchVariationOption() {
      setLoading(true);
      try {
        const response = await fetch(`/api/variationoptions?id=${id}`);
        const data = await response.json();
        setFormData({
          variationTypeId: data.variationTypeId ? String(data.variationTypeId) : '',
          label: data.label || '',
          description: data.description || '',
          image: data.image || '',
          staffImage: data.staffImage || '',
          priceDelta: data.priceDelta || '',
          staffPriceDelta: data.staffPriceDelta || '',
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
  if (!formData.variationTypeId) newErrors.variationTypeId = 'Type is required.';
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
    let staffImageUrl = formData.staffImage;
    if (staffImageFile) {
      const imgForm = new FormData();
      imgForm.append('files', staffImageFile);
      const res = await fetch('/api/upload', { method: 'POST', body: imgForm });
      const data = await res.json();
      staffImageUrl = data.files?.[0]?.url || '';
    }

    const submitData = {
      ...formData,
      image: imageUrl,
      staffImage: staffImageUrl,
      id: id ? Number(id) : undefined,
      variationTypeId: formData.variationTypeId ? Number(formData.variationTypeId) : undefined,
      floorPlanId: formData.floorPlanId ? Number(formData.floorPlanId) : undefined,
      order: formData.order ? Number(formData.order) : undefined,
      priceDelta: formData.priceDelta ? Number(formData.priceDelta) : undefined,
      staffPriceDelta: formData.staffPriceDelta ? Number(formData.staffPriceDelta) : undefined,
    };
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
          <label className="block text-sm font-medium text-gray-700">Staff Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setStaffImageFile(e.target.files[0])}
            className="border border-gray-300 p-2 rounded w-full"
          />
          {formData.staffImage && !staffImageFile && (
            <img src={formData.staffImage} alt="Staff Preview" className="mt-2 h-16" />
          )}
          <label className="block text-sm font-medium text-gray-700">Staff Price Delta</label>
          <input
            type="number"
            placeholder="Staff Price Delta"
            value={formData.staffPriceDelta}
            onChange={(e) => setFormData({ ...formData, staffPriceDelta: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <label className="block text-sm font-medium text-gray-700">Type*</label>
          <select
            value={formData.variationTypeId}
            onChange={e => setFormData({ ...formData, variationTypeId: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
            required
          >
            <option value="">Select Type*</option>
            {variationTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label || type.name}</option>
            ))}
          </select>
          {errors.variationTypeId && <div className="text-red-500 text-sm">{errors.variationTypeId}</div>}
          <label className="block text-sm font-medium text-gray-700">Label*</label>
          <input
            type="text"
            placeholder="Label*"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          {errors.label && <div className="text-red-500 text-sm">{errors.label}</div>}
          <label className="block text-sm font-medium text-gray-700">Description</label>
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
          <label className="block text-sm font-medium text-gray-700">Price Delta</label>
          <input
            type="number"
            placeholder="Price Delta"
            value={formData.priceDelta}
            onChange={(e) => setFormData({ ...formData, priceDelta: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          {errors.priceDelta && <div className="text-red-500 text-sm">{errors.priceDelta}</div>}
          <div className="flex items-center space-x-2">
            <label className="text-gray-700">Active</label>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <label className="block text-sm font-medium text-gray-700">Order</label>
          <input
            type="number"
            placeholder="Order"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          {errors.order && <div className="text-red-500 text-sm">{errors.order}</div>}
          <label className="block text-sm font-medium text-gray-700">Floor Plan*</label>
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
