/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
          serverActions: {
                  bodySizeLimit: '2mb',
          },
    },
    images: {
          domains: [],
    },
    typescript: {
          ignoreBuildErrors: true,
    },
    eslint: {
          ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
