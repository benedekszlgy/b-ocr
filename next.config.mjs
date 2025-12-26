/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Silence Turbopack warning - using default Turbopack with webpack fallback
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

export default nextConfig;
