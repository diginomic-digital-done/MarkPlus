import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../dashboard/layout';

export default function StatesList() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/states')
      .then((res) => res.json())
      .then((data) => {
        setStates(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this state?')) return;
    const response = await fetch(`/api/states/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setStates((prev) => prev.filter((state) => state.id !== id));
    } else {
      alert('Failed to delete state.');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">All States</h1>
        <Link href="/backend/states/add" legacyBehavior>
          <a className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">Add New State</a>
        </Link>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Code</th>
                <th className="py-2 px-4 border-b">Active</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {states.map((state) => (
                <tr key={state.id}>
                  <td className="py-2 px-4 border-b">{state.name}</td>
                  <td className="py-2 px-4 border-b">{state.code}</td>
                  <td className="py-2 px-4 border-b">{state.isActive ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 border-b">
                    <Link href={`/backend/states/edit?id=${state.id}`} legacyBehavior>
                      <a className="text-blue-500 hover:underline mr-2">Edit</a>
                    </Link>
                    <button
                      onClick={() => handleDelete(state.id)}
                      className="text-red-500 hover:underline ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
