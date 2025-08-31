import type { NextConfig } from 'next';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error - next-pwa has no ESM types for Next 15 yet; runtime is fine
import withPWA from 'next-pwa';
import path from 'path';

const baseConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  compress: true,
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = withPWA({
  dest: 'public',
  disable: !isProd,
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  cacheId: 'sugvoyage-pwa',
  buildExcludes: [/middleware-manifest\.json$/],
  publicExcludes: ['!manifest.json'],
  fallbacks: {
    document: '/offline',
  },
  runtimeCaching: [
    {
      // Static assets: JS, CSS, Fonts
      urlPattern: ({ request }: { request: Request }) =>
        ['script', 'style', 'font'].includes((request as any).destination as string),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      // Images
      urlPattern: ({ request }: { request: Request }) => (request as any).destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      // API routes (local /api/*)
      urlPattern: /\/api\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24, // 1 day
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
})(baseConfig);

export default nextConfig;
