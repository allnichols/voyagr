import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // "https://maps.gstatic.com/mapfiles/place_api/icons/v2/cafe_pinlet"
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.gstatic.com',
        port: '',
        pathname: '/mapfiles/**',
      },
      {
        protocol: "https",
        hostname: "img.daisyui.com",
        port: "",
        pathname: '/images/**'
      }
     ]
  }
};

export default nextConfig;
