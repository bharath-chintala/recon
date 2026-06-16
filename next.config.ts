import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'tcmrisdbvzghjtqtdrys.supabase.co',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias['framer-motion'] = path.resolve(__dirname, 'src/lib/framer-motion-mock.tsx');
    return config;
  },
  turbopack: {
    resolveAlias: {
      'framer-motion': './src/lib/framer-motion-mock.tsx',
    },
  },
  experimental: {
    webpackBuildWorker: true,
  },
};

export default nextConfig;
