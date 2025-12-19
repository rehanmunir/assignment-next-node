import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
    // Use unoptimized images to avoid server-side fetching issues in Docker
    unoptimized: true,
  },
};

export default nextConfig;
