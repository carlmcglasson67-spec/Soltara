import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@soltata/engine'],
  images: { formats: ['image/avif', 'image/webp'] },
};

export default nextConfig;
