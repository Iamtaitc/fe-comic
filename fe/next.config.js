/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  // 🚀 Optimized image configuration
  images: {
    domains: [
      "localhost",
      "img.otruyenapi.com",
      "sv1.otruyencdn.com",
    ],
    formats: ["image/webp", "image/avif"], // 🔧 WebP first, then AVIF
    
    // 🚀 Performance settings
    minimumCacheTTL: 300, // 5 minutes cache
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // 🔧 Reduced sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // 🔧 Optimized sizes
    
    // 🔧 Remote patterns (more secure than domains)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sv1.otruyencdn.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'img.otruyenapi.com',
        pathname: '/**',
      },
    ],
    
    // 🚀 Disable for CDN images (they're already optimized)
    unoptimized: false,
  },
  
  // 🚀 Experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
    optimizeCss: true, // 🔧 CSS optimization
  },
  
  // 🔧 Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // 🚀 Remove console.log in production
  },
  
  env: {
    API_URL: process.env.API_URL,
  },
};

module.exports = nextConfig;