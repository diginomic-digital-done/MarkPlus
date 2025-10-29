import { useEffect, useState } from 'react';
import DashboardLayout from '../dashboard/layout';
import Link from 'next/link';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/router';
import UserInfoPopup from './UserInfoPopup';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error('Unexpected API response:', data);
          alert('Failed to fetch users. Please try again later.');
          return;
        }

        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('An error occurred while fetching users.');
      }
    }
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return; // Exit if the user cancels the deletion

    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to delete user:', errorData); // Log error details
        alert(`Failed to delete user: ${errorData.error}`);
        return;
      }

      setUsers(users.filter((user) => user.id !== id));
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error in handleDelete:', error); // Log unexpected errors
      alert('An unexpected error occurred while deleting the user.');
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedUser(null);
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await fetch('/api/users/assign-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update role:', errorData);
        alert(`Failed to update role: ${errorData.error}`);
        return;
      }

      const updatedUser = await response.json();
      setUsers(users.map((user) => (user.id === id ? updatedUser.user : user)));
      alert('Role updated successfully!');
    } catch (error) {
      console.error('Error updating role:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleStateChange = async (id, newState) => {
    try {
      const response = await fetch('/api/users/update-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, state: newState }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update state:', errorData);
        alert(`Failed to update state: ${errorData.error}`);
        return;
      }

      const updatedUser = await response.json();
      setUsers(users.map((user) => (user.id === id ? updatedUser.user : user)));
      alert('State updated successfully!');
    } catch (error) {
      console.error('Error updating state:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-gray-800">User Management</h1>

      <div className="my-4">
        <input
          type="text"
          placeholder="Filter by email"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="my-4">
        <Link href="/backend/users/create" legacyBehavior>
          <a className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none">
            Create User
          </a>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">First Name</th>
              <th className="px-4 py-2 text-left">Last Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Mobile</th>
              <th className="px-4 py-2 text-left">State</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) => user.email.includes(filter))
              .map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2">{user.firstName}</td>
                  <td className="px-4 py-2">{user.lastName}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.mobile}</td>
                  <td className="px-4 py-2">{user.state}</td>
                  <td className="px-4 py-2">{user.role?.name}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                      title="View"
                      onClick={() => handleView(user)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none"
                      title="Edit"
                      onClick={() => router.push(`/backend/users/edit?id=${user.id}`)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <UserInfoPopup
        isOpen={isPopupOpen}
        user={selectedUser}
        onClose={closePopup}
      />
    </DashboardLayout>
  );
}