/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
