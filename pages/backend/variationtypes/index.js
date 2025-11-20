import { useEffect, useState } from 'react';
import DashboardLayout from '../dashboard/layout';

export default function VariationTypeAdmin() {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({ name: '', label: '', isActive: true });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  // Fetch all variation types
  useEffect(() => {
    fetchTypes();
  }, []);

  async function fetchTypes() {
    const res = await fetch('/api/variationtypes');
    const data = await res.json();
    setTypes(Array.isArray(data) ? data : []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { ...form, id: editingId } : form;
      const res = await fetch('/api/variationtypes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Failed to save variation type');
      setForm({ name: '', label: '', isActive: true });
      setEditingId(null);
      fetchTypes();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(type) {
    setForm({ name: type.name, label: type.label, isActive: type.isActive });
    setEditingId(type.id);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this variation type?')) return;
    await fetch('/api/variationtypes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchTypes();
  }

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Variation Type Management</h1>
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2 rounded w-full" required />
          <input type="text" placeholder="Label" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} className="border p-2 rounded w-full" required />
          <label className="flex items-center"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="mr-2" />Active</label>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Add'} Variation Type</button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Label</th>
              <th className="p-2">Active</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {types.map(type => (
              <tr key={type.id}>
                <td className="p-2">{type.name}</td>
                <td className="p-2">{type.label}</td>
                <td className="p-2">{type.isActive ? 'Yes' : 'No'}</td>
                <td className="p-2">
                  <button className="text-blue-500 mr-2" onClick={() => handleEdit(type)}>Edit</button>
                  <button className="text-red-500" onClick={() => handleDelete(type.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
