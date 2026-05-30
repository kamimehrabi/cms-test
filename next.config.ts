import type { NextConfig } from "next";

const cdnPrefixUrl = process.env.NEXT_PUBLIC_CDN_PREFIX_URL;
if (!cdnPrefixUrl) {
  throw new Error('NEXT_PUBLIC_CDN_PREFIX_URL is not set');
}
const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.190'],

  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "image123.azureedge.net",
      },
    ],
  },
};

export default nextConfig;
