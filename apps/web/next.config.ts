import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@soltara/engine'],
  images: { formats: ['image/avif', 'image/webp'] },
};

export default nextConfig;
