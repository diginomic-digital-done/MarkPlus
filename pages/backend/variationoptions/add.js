import { useState } from 'react';
import DashboardLayout from '../dashboard/layout';

export default function AddVariationOption() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/variationoptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      alert('Variation Option created successfully!');
      setFormData({
        type: '',
        label: '',
        description: '',
        image: '',
        priceDelta: '',
        isActive: true,
        order: '',
        floorPlanId: '',
      });
    } else {
      alert('Failed to create Variation Option.');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Add New Variation Option</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Label"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Price Delta"
            value={formData.priceDelta}
            onChange={(e) => setFormData({ ...formData, priceDelta: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
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
          <input
            type="number"
            placeholder="Order"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Floor Plan ID"
            value={formData.floorPlanId}
            onChange={(e) => setFormData({ ...formData, floorPlanId: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Create Variation Option
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}