import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('');

  useEffect(() => {
    if (router.pathname.startsWith('/backend/floorplans')) {
      setActiveMenu('floorplans');
    } else if (router.pathname.startsWith('/backend/regions')) {
      setActiveMenu('regions');
    } else if (router.pathname.startsWith('/backend/variationoptions')) {
      setActiveMenu('variationoptions');
    } else if (router.pathname.startsWith('/backend/users')) {
      setActiveMenu('users');
    } else {
      setActiveMenu('');
    }
  }, [router.pathname]);

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">Admin Dashboard</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/backend/dashboard" legacyBehavior>
            <a className="block px-4 py-2 rounded hover:bg-gray-700">Dashboard</a>
          </Link>
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
        </nav>
      </aside>
      <main className="content flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}