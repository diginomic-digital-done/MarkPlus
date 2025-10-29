import { useEffect, useState } from 'react';
import DashboardLayout from '../dashboard/layout';
import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function Regions() {
  const [regions, setRegions] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    async function fetchRegions() {
      try {
        const response = await fetch('/api/regions');
        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error('Unexpected API response:', data);
          alert('Failed to fetch regions. Please try again later.');
          return;
        }

        setRegions(data);
      } catch (error) {
        console.error('Error fetching regions:', error);
        alert('An error occurred while fetching regions.');
      }
    }
    fetchRegions();
    fetch('/api/states')
      .then((res) => res.json())
      .then((data) => setStates(data));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this region?');
    if (!confirmDelete) return;

    try {
      await fetch(`/api/regions/${id}`, { method: 'DELETE' });
      setRegions((prev) => prev.filter((region) => region.id !== id));
    } catch (error) {
      console.error('Error deleting region:', error);
      alert('Failed to delete region.');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Regions</h1>
        <div className="mb-4">
          <Link href="/backend/regions/add" legacyBehavior>
            <a className="bg-blue-500 text-white px-4 py-2 rounded">Add New Region</a>
          </Link>
        </div>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Code</th>
              <th className="p-2">State</th>
              <th className="p-2">Active</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => {
              const state = states.find((s) => s.id === region.stateId);
              return (
                <tr key={region.id} className="border-b">
                  <td className="p-2">{region.name}</td>
                  <td className="p-2">{region.code}</td>
                  <td className="p-2">{state ? state.name : '-'}</td>
                  <td className="p-2">{region.isActive ? 'Yes' : 'No'}</td>
                  <td className="p-2">
                    <div className="flex space-x-2">
                      <Link href={`/backend/regions/edit/${region.id}`} legacyBehavior>
                        <a className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</a>
                      </Link>
                      <button
                        onClick={() => handleDelete(region.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}