/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "held-accountable.vercel.app",
      },
    ],
  },
};

export default nextConfig;
