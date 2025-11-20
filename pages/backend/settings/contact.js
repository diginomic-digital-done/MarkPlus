import { useState } from 'react';
import DashboardLayout from '../dashboard/layout';

export default function ContactSettings() {
  const [form, setForm] = useState({
    supportEmail: '',
    supportPhone: '',
    address: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Save settings via API (to be implemented)
    setMessage('Contact info saved!');
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Contact Info Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <label className="block text-sm font-medium text-gray-700">Support Email</label>
          <input
            type="email"
            name="supportEmail"
            value={form.supportEmail}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <label className="block text-sm font-medium text-gray-700">Support Phone</label>
          <input
            type="text"
            name="supportPhone"
            value={form.supportPhone}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Contact Info</button>
          {message && <div className="text-green-600 mt-2">{message}</div>}
        </form>
      </div>
    </DashboardLayout>
  );
}
