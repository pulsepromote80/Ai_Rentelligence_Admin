/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apis.rentelligence.online',
      },
    ],
  },
};

export default nextConfig;
