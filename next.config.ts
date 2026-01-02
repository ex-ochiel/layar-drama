import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "asianimg.pro",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.sansekai.my.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.dramabox.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
