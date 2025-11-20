

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isStaffAuthenticated } from '../../../utils/auth';
import DashboardLayout from './layout';

// Server-side authentication check
export async function getServerSideProps(context) {
  const { req } = context;
  // Check for staff token in cookies
  const cookies = req.headers.cookie || '';
  const hasToken = cookies.includes('staffAuthToken');
  if (!hasToken) {
    return {
      redirect: {
        destination: '/staff-login',
        permanent: false,
      },
    };
  }
  return { props: {} };
}

export default function Dashboard() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined' && !isStaffAuthenticated()) {
      router.replace('/staff-login');
    }
  }, [router]);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-gray-800">Welcome to the Admin Dashboard</h1>
      <p className="mt-4 text-gray-600">Here you can manage all backend functionalities.</p>
    </DashboardLayout>
  );
}
