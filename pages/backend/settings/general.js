import { useState } from 'react';
import DashboardLayout from '../dashboard/layout';

export default function GeneralSettings() {
  const [form, setForm] = useState({
    siteTitle: '',
    logo: '',
    favicon: '',
    copyright: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleFaviconChange = (e) => {
    setFaviconFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let logoUrl = form.logo;
    if (logoFile) {
      const imgForm = new FormData();
      imgForm.append('files', logoFile);
      const res = await fetch('/api/upload', { method: 'POST', body: imgForm });
      const data = await res.json();
      logoUrl = data.files?.[0]?.url || '';
    }
    let faviconUrl = form.favicon;
    if (faviconFile) {
      const imgForm = new FormData();
      imgForm.append('files', faviconFile);
      const res = await fetch('/api/upload', { method: 'POST', body: imgForm });
      const data = await res.json();
      faviconUrl = data.files?.[0]?.url || '';
    }
    // Save settings via API (to be implemented)
    setMessage('Settings saved!');
    setForm({ ...form, logo: logoUrl, favicon: faviconUrl });
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">General Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <label className="block text-sm font-medium text-gray-700">Site Title</label>
          <input
            type="text"
            name="siteTitle"
            value={form.siteTitle}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          {form.logo && !logoFile && (
            <img src={form.logo} alt="Logo Preview" className="mt-2 h-16" />
          )}
          <label className="block text-sm font-medium text-gray-700">Favicon</label>
          <input
            type="file"
            accept="image/x-icon,image/png"
            onChange={handleFaviconChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          {form.favicon && !faviconFile && (
            <img src={form.favicon} alt="Favicon Preview" className="mt-2 h-8" />
          )}
          <label className="block text-sm font-medium text-gray-700">Copyright Text</label>
          <input
            type="text"
            name="copyright"
            value={form.copyright}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Settings</button>
          {message && <div className="text-green-600 mt-2">{message}</div>}
        </form>
      </div>
    </DashboardLayout>
  );
}
