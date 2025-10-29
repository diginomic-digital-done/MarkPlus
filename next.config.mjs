/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/dashboard',             // URL user visits
        destination: '/backend/dashboard', // actual file path in pages/
      },
       {
        source: '/listing',             // URL user visits
        destination: '/backend/listing', // actual file path in pages/
      },
    ];
  },
};

export default nextConfig;
