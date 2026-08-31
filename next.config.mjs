/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/journeys',
        destination: '/destinations',
        permanent: true,
      },
      {
        source: '/journeys/:slug*',
        destination: '/destinations',
        permanent: true,
      }
    ];
  }
};

export default nextConfig;
