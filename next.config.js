const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  fallbacks: {
    // document: '/offline', // Causes _document error in App Router
  },
  workboxOptions: {
    runtimeCaching: [
      // ─── Static assets (fonts, images, CSS, JS) ─────────
      {
        urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts',
          expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-images',
          expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
      // ─── Next.js static assets ─────────────────────────
      {
        urlPattern: /\/_next\/static\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'next-static',
          expiration: { maxEntries: 64, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
      // ─── Search results (Stale While Revalidate) ───────
      {
        urlPattern: /\/search\?.*/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'search-results',
          expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 },
        },
      },
      // ─── Bookings page (Stale While Revalidate) ────────
      {
        urlPattern: /\/bookings$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'bookings-page',
          expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 },
        },
      },
      // ─── Supabase API calls (Network First) ────────────
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'supabase-api',
          expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 },
          networkTimeoutSeconds: 10,
        },
      },
      // ─── All other pages (Network First) ───────────────
      {
        urlPattern: /^https?:\/\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'others',
          expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
          networkTimeoutSeconds: 10,
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Images ───────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },

  // ─── Experimental ─────────────────────────────────────
  experimental: {
    typedRoutes: true,
  },

  // ─── Headers ──────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
