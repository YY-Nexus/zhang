/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
  },
  turbopack: {
    root: '.',
  },
};

module.exports = nextConfig;