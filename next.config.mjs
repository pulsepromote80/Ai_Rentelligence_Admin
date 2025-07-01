/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apis.rentelligence.biz',
      },
    ],
  },
};

export default nextConfig;
