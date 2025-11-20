import { useState } from 'react';
import DashboardLayout from '../dashboard/layout';

export default function SocialSettings() {
  const [form, setForm] = useState({
    facebook: '',
    twitter: '',
    instagram: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Save settings via API (to be implemented)
    setMessage('Social links saved!');
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Social Links Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <label className="block text-sm font-medium text-gray-700">Facebook</label>
          <input
            type="url"
            name="facebook"
            value={form.facebook}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <label className="block text-sm font-medium text-gray-700">Twitter</label>
          <input
            type="url"
            name="twitter"
            value={form.twitter}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <label className="block text-sm font-medium text-gray-700">Instagram</label>
          <input
            type="url"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Social Links</button>
          {message && <div className="text-green-600 mt-2">{message}</div>}
        </form>
      </div>
    </DashboardLayout>
  );
}
