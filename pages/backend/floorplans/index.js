import { useEffect, useState } from 'react';
import DashboardLayout from '../dashboard/layout';
import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function FloorPlans() {
  const [floorPlans, setFloorPlans] = useState([]);

  useEffect(() => {
    async function fetchFloorPlans() {
      try {
        const response = await fetch('/api/floorplans');
        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error('Unexpected API response:', data);
          alert('Failed to fetch floor plans. Please try again later.');
          return;
        }

        setFloorPlans(data);
      } catch (error) {
        console.error('Error fetching floor plans:', error);
        alert('An error occurred while fetching floor plans.');
      }
    }
    fetchFloorPlans();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this floor plan?');
    if (!confirmDelete) return;

    try {
      await fetch(`/api/floorplans/${id}`, { method: 'DELETE' });
      setFloorPlans((prev) => prev.filter((plan) => plan.id !== id));
    } catch (error) {
      console.error('Error deleting floor plan:', error);
      alert('Failed to delete floor plan.');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Floor Plans</h1>
        <div className="mb-4">
          <Link href="/backend/floorplans/add" legacyBehavior>
            <a className="bg-blue-500 text-white px-4 py-2 rounded">Add New Floor Plan</a>
          </Link>
        </div>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Title</th>
              <th className="p-2">Region</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {floorPlans.map((floorPlan) => (
              <tr key={floorPlan.id} className="border-b">
                <td className="p-2">{floorPlan.title}</td>
                <td className="p-2">{floorPlan.regionId}</td>
                <td className="p-2">{floorPlan.status}</td>
                <td className="p-2">
                  <div className="flex space-x-2">
                    <Link href={`/backend/floorplans/edit/${floorPlan.id}`} legacyBehavior>
                      <a className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</a>
                    </Link>
                    <button
                      onClick={() => handleDelete(floorPlan.id)}
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