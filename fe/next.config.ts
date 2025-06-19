// next.config.js
declare var process: any;
declare var module: any;
/** @type {import('next').NextConfig} */
// const withPWA = require('next-pwa')({
//   dest: 'public',
//   disable: process.env.NODE_ENV === 'development',
//   register: true,
//   skipWaiting: true,
// });
const nextConfig = {
  images: {
    domains: [
      'localhost', // Cho môi trường development
      'img.otruyenapi.com',
      // Thêm các domain khác chứa hình ảnh truyện tranh
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Cấu hình redirects
  async redirects() {
    return [
      {
        source: '/truyen/:slug',
        destination: '/story/:slug',
        permanent: true,
      },
    ];
  },
  // Cấu hình rewrites cho việc proxy API requests
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/v1/:path*',
          destination: `https://d050-2402-800-620e-5501-3887-23ea-2857-27e.ngrok-free.app/api/v1/:path*`,
        },
      ],
    };
  },
};

module.exports = nextConfig;