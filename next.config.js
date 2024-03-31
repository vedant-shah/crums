/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      { hostname: "www.archanaskitchen.com" },
      { hostname: "img.icons8.com" },
    ],
  },
};

module.exports = nextConfig;
