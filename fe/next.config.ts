// next.config.js
import type { NextConfig } from 'next';

declare const process: {
  env: {
    NODE_ENV: string;
    API_BASE_URL?: string;
    NEXT_PUBLIC_API_URL?: string;
  };
};

// const withPWA = require('next-pwa')({
//   disable: process.env.NODE_ENV === 'development',
//   register: true,
//   skipWaiting: true,
// });

const nextConfig: NextConfig = {
  images: {
    domains: [
      'localhost', // Cho môi trường development
      'img.otruyenapi.com',
      'sv1.otruyencdn.com'
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
          destination: `https://04df-2402-800-620e-a4b0-f829-eca7-60c6-1c6f.ngrok-free.app/api/v1/:path*`,
        },
      ],
    };
  },
};


module.exports = nextConfig;