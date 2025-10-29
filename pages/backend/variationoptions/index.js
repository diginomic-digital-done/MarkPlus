import { useEffect, useState } from 'react';
import DashboardLayout from '../dashboard/layout';
import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function VariationOptions() {
  const [variationOptions, setVariationOptions] = useState([]);

  useEffect(() => {
    async function fetchVariationOptions() {
      try {
        const response = await fetch('/api/variationoptions');
        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error('Unexpected API response:', data);
          alert('Failed to fetch variation options. Please try again later.');
          return;
        }

        setVariationOptions(data);
      } catch (error) {
        console.error('Error fetching variation options:', error);
        alert('An error occurred while fetching variation options.');
      }
    }
    fetchVariationOptions();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this variation option?');
    if (!confirmDelete) return;

    try {
      await fetch(`/api/variationoptions/${id}`, { method: 'DELETE' });
      setVariationOptions((prev) => prev.filter((option) => option.id !== id));
    } catch (error) {
      console.error('Error deleting variation option:', error);
      alert('Failed to delete variation option.');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Variation Options</h1>
        <div className="mb-4">
          <Link href="/backend/variationoptions/add" legacyBehavior>
            <a className="bg-blue-500 text-white px-4 py-2 rounded">Add New Variation Option</a>
          </Link>
        </div>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Type</th>
              <th className="p-2">Label</th>
              <th className="p-2">Active</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {variationOptions.map((option) => (
              <tr key={option.id} className="border-b">
                <td className="p-2">{option.type}</td>
                <td className="p-2">{option.label}</td>
                <td className="p-2">{option.isActive ? 'Yes' : 'No'}</td>
                <td className="p-2">
                  <div className="flex space-x-2">
                    <Link href={`/backend/variationoptions/edit/${option.id}`} legacyBehavior>
                      <a className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</a>
                    </Link>
                    <button
                      onClick={() => handleDelete(option.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}