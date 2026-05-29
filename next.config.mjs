/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  // Cloudflare Pages compatibility - don't use static export for API routes
  // trailingSlash: true,
  // Disable image optimization for Cloudflare Pages
  images: {
    unoptimized: true
  }
};

export default nextConfig;
