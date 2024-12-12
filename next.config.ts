import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com", "res.cloudinary.com"], // Add both domains
  },
};

export default nextConfig;
