/**
 * RMS Creations Service Worker
 * Smart Cache Management & Version-based Cache Invalidation
 */

const CACHE_VERSION = 'rms-v1.6.31';
const STATIC_CACHE_NAME = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE_NAME = `${CACHE_VERSION}-dynamic`;

// Core static assets to cache during install
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/assets/logo.png',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

// URLs that should never be cached (Auth, Payments, APIs, Realtime)
const BYPASS_CACHE_DOMAINS = [
  'supabase.co',
  'api.razorpay.com',
  'checkout.razorpay.com',
  'apis.google.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('[SW] Core assets pre-caching failed (safe to continue):', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  // Purge any old version caches immediately
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key.startsWith('rms-') && !key.startsWith(CACHE_VERSION)) {
            console.log('[SW] Purging outdated cache:', key);
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: CACHE_VERSION });
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Never cache non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // 2. Bypass API, Supabase, and Payment gateways
  if (BYPASS_CACHE_DOMAINS.some((domain) => url.hostname.includes(domain)) || url.pathname.includes('/rest/v1/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 3. Version file is always Network-First without cache
  if (url.pathname.endsWith('version.json')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // 4. HTML Navigation requests: Network-first, fallback to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match('/index.html').then((cached) => {
            return cached || caches.match('/');
          });
        })
    );
    return;
  }

  // 5. Static assets (hashed js/css, fonts, images): Cache-first with stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache for non-immutable assets
        if (!url.pathname.includes('chunk-') && !url.pathname.includes('styles-')) {
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse);
                });
              }
            })
            .catch(() => {/* Offline fallback */});
        }
        return cachedResponse;
      }

      // Not cached, fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is an image, could return offline placeholder
          return new Response('Network unavailable', { status: 503, statusText: 'Offline' });
        });
    })
  );
});
