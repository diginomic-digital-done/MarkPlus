import React from 'react';

const UserInfoPopup = ({ isOpen, user, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
        <h2 className="text-xl font-bold mb-4">User Information</h2>
        <table className="table-auto w-full">
          <tbody>
            <tr>
              <td className="font-semibold">First Name:</td>
              <td>{user.firstName}</td>
            </tr>
            <tr>
              <td className="font-semibold">Last Name:</td>
              <td>{user.lastName}</td>
            </tr>
            <tr>
              <td className="font-semibold">Email:</td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td className="font-semibold">Mobile:</td>
              <td>{user.mobile}</td>
            </tr>
            <tr>
              <td className="font-semibold">Region:</td>
              <td>{user.region}</td>
            </tr>
            <tr>
              <td className="font-semibold">Role:</td>
              <td>{user.role?.name}</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfoPopup;