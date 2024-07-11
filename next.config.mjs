/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app.editionsinspace.com',
        port: '',
        pathname: '/assets/**',
      },
    ],
  }
};

export default nextConfig;
