import DashboardLayout from './layout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-gray-800">Welcome to the Admin Dashboard</h1>
      <p className="mt-4 text-gray-600">Here you can manage all backend functionalities.</p>
    </DashboardLayout>
  );
}
