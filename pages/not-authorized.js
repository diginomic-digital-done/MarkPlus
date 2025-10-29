export default function NotAuthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600">Not Authorized</h1>
        <p className="mt-4 text-gray-700">You do not have permission to access this page.</p>
        <a
          href="/backend"
          className="mt-6 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}