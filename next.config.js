/** @type {import('next').NextConfig} */
module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  images: {
    // Remote image domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd1umvm78v43sxr.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'architect-cms-images-adpl.s3.ap-south-1.amazonaws.com',
        pathname: '/**',
      },
    ],
    // Image optimization settings
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 1 year (immutable)
    minimumCacheTTL: 31536000,
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable compression
  compress: true,
  // Power optimizations
  poweredByHeader: false,
  // Redirect legacy routes (can be removed once old URLs are no longer in use)
  async redirects() {


    return [
      // Redirect /services to /mainservice (main services listing page)
      { source: '/services', destination: '/mainservice', permanent: true },
    ];
  },
  // Cache headers for static assets
  async headers() {
    return [
      {
        // Cache static assets for 1 year
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache JS/CSS for 1 year (they have content hashes)
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
