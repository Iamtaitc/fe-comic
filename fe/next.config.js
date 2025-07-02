/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bật Strict Mode của React để phát hiện sớm các vấn đề tiềm ẩn
  reactStrictMode: true,

  // Tắt header "x-powered-by: Next.js" để tăng cường bảo mật
  poweredByHeader: false,

  // Cấu hình tối ưu hóa hình ảnh
  images: {
    domains: [
      'localhost', // Cho môi trường development
      'img.otruyenapi.com',
      'sv1.otruyencdn.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Ví dụ về biến môi trường public
  env: {
    API_URL: process.env.API_URL, // Lấy giá trị từ file .env
  },

  // Ví dụ về redirect: khi người dùng vào /truyen-cu, sẽ được chuyển sang /truyen-moi
  async redirects() {
    return [
      {
        source: '/truyen-cu',
        destination: '/truyen-moi',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
