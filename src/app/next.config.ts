import type { NextConfig } from "next";

const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';

const nextConfig: NextConfig = {
  // Remove basePath and assetPrefix since we're using the root domain
  output: 'export',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig; 