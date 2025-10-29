import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('');

  useEffect(() => {
    // Determine the active menu based on the current URL
    if (router.pathname.startsWith('/backend/floorplans')) {
      setActiveMenu('floorplans');
    } else if (router.pathname.startsWith('/backend/regions')) {
      setActiveMenu('regions');
    } else if (router.pathname.startsWith('/backend/states')) {
      setActiveMenu('states');
    } else if (router.pathname.startsWith('/backend/variationoptions')) {
      setActiveMenu('variationoptions');
    } else if (router.pathname.startsWith('/backend/users')) {
      setActiveMenu('users');
    } else {
      setActiveMenu('');
    }
  }, [router.pathname]);

  const handleLogout = () => {
    // Clear session or authentication tokens here
    console.log('User logged out');
    router.push('/backend'); // Redirect to login page
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Menu */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">Admin Dashboard</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/backend/dashboard" legacyBehavior>
            <a className="block px-4 py-2 rounded hover:bg-gray-700">Dashboard</a>
          </Link>

          {/* Floor Plans Menu */}
          <div>
            <button
              onClick={() => setActiveMenu(activeMenu === 'floorplans' ? '' : 'floorplans')}
              className="flex items-center justify-between w-full text-left px-4 py-2 rounded hover:bg-gray-700 focus:outline-none"
            >
              <span>Floor Plans</span>
              {activeMenu === 'floorplans' ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {activeMenu === 'floorplans' && (
              <div className="ml-4 space-y-2">
                <Link href="/backend/floorplans/add" legacyBehavior>
                  <a className="block px-4 py-2 rounded hover:bg-gray-700">Add New</a>
                </Link>
                <Link href="/backend/floorplans" legacyBehavior>
                  <a className="block px-4 py-2 rounded hover:bg-gray-700">View All</a>
                </Link>
              </div>
            )}
          </div>

          {/* States Menu */}
          <div>
            <button
              onClick={() => setActiveMenu(activeMenu === 'states' ? '' : 'states')}
              className="flex items-center justify-between w-full text-left px-4 py-2 rounded hover:bg-gray-700 focus:outline-none"
            >
              <span>States</span>
              {activeMenu === 'states' ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {activeMenu === 'states' && (
              <div className="ml-4 space-y-2">
                <Link href="/backend/states/add" legacyBehavior>
                  <a className="block px-4 py-2 rounded hover:bg-gray-700">Add New</a>
                </Link>
                <Link href="/backend/states" legacyBehavior>
                  <a className="block px-4 py-2 rounded hover:bg-gray-700">View All</a>
                </Link>
              </div>
            )}
          </div>

          {/* Regions Menu */}
          <div>
            <button
              onClick={() => setActiveMenu(activeMenu === 'regions' ? '' : 'regions')}
              className="flex items-center justify-between w-full text-left px-4 py-2 rounded hover:bg-gray-700 focus:outline-none"
            >
              <span>Regions</span>
              {activeMenu === 'regions' ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {activeMenu === 'regions' && (
              <div className="ml-4 space-y-2">
                <Link href="/backend/regions/add" legacyBehavior>
                  <a className="block px-4 py-2 rounded hover:bg-gray-700">Add New</a>
                </Link>
                <Link href="/backend/regions" legacyBehavior>
                  <a className="block px-4 py-2 rounded hover:bg-gray-700">View All</a>
                </Link>
              </div>
            )}
          </div>

          {/* Variation Options Menu */}
          <div>
            <button
              onClick={() => setActiveMenu(activeMenu === 'variationoptions' ? '' : 'variationoptions')}
              className="flex items-center justify-between w-full text-left px-4 py-2 rounded hover:bg-gray-700 focus:outline-none"
            >
              <span>Variation Options</span>
              {activeMenu === 'variationoptions' ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {activeMenu === 'variationoptions' && (
              <div className="ml-4 space-y-2">
                <Link href="/backend/variationoptions/add" legacyBehavior>
                  <a className="block px-4 py-2 rounded hover:bg-gray-700">Add New</a>
                </Link>
                <Link href="/backend/variationoptions" legacyBehavior>
                  <a className="block px-4 py-2 rounded hover:bg-gray-700">View All</a>
                </Link>
              </div>
            )}
          </div>

          {/* User Management Menu */}
          <div>
            <button
              onClick={() => setActiveMenu(activeMenu === 'users' ? '' : 'users')}
              className="flex items-center justify-between w-full text-left px-4 py-2 rounded hover:bg-gray-700 focus:outline-none"
            >
              <span>User Management</span>
              {activeMenu === 'users' ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {activeMenu === 'users' && (
              <div className="ml-4 space-y-2">
                <Link href="/backend/users" legacyBehavior>
                  <a className="block px-4 py-2 rounded hover:bg-gray-700">View Users</a>
                </Link>
                <Link href="/backend/users/create" legacyBehavior>
                  <a className="block px-4 py-2 rounded hover:bg-gray-700">Create User</a>
                </Link>
              </div>
            )}
          </div>
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}