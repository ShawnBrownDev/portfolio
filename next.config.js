/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['rodmfztnajivqwpythrl.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rodmfztnajivqwpythrl.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    // Disable source maps in development to avoid debugger issues
    config.devtool = false;
    return config;
  },
};

module.exports = nextConfig;
