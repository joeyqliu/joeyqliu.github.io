import type { NextConfig } from "next";

const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';

const nextConfig: NextConfig = {
  basePath: isGitHubPages ? '/joeyqliu' : '',
  assetPrefix: isGitHubPages ? '/joeyqliu/' : '',
  output: 'export',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;