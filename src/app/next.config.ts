import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove basePath and assetPrefix since we're using the root domain
  output: 'export',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig; 