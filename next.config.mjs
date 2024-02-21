/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [{ hostname: "www.archanaskitchen.com" }],
  },
};

export default nextConfig;
