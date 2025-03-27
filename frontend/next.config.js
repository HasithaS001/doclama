/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5000/uploads/:path*',
      },
      {
        source: '/api/pdf/:id',
        destination: 'http://localhost:5000/api/pdf/:id',
      },
      {
        source: '/api/docx/:id',
        destination: 'http://localhost:5000/api/docx/:id',
      },
    ];
  }
};

module.exports = nextConfig;
