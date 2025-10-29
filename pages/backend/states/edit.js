import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../dashboard/layout';

export default function EditState() {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/states/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name || '',
            code: data.code || '',
            isActive: data.isActive ?? true,
          });
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/states/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      alert('State updated successfully!');
      router.push('/backend/states');
    } else {
      alert('Failed to update State.');
    }
  };

  if (loading) return <DashboardLayout><div className="p-6">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Edit State</h1>
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
            Update State
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
