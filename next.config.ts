// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     domains: ['res.cloudinary.com'],
//   },
// };

// export default nextConfig;
// next.config.js
import type { NextConfig } from "next";

module.exports = {
  compiler: {
    // Remove all console logs
    removeConsole: false
  },
  images: {
    domains: [
      'res.cloudinary.com',
      'www.youtube.com',
      'img.youtube.com',
      'via.placeholder.com',
      'example.com'
    ],
  },
  devIndicators: {
    position: false
  }
};

const nextConfig: NextConfig = {
};

export default nextConfig;