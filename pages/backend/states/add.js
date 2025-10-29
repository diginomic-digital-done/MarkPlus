import { useState } from 'react';
import DashboardLayout from '../dashboard/layout';

export default function AddState() {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    isActive: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/states', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      alert('State created successfully!');
      setFormData({ name: '', code: '', isActive: true });
    } else {
      alert('Failed to create State.');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Add New State</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
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
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Create State
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
