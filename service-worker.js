/* Basic Service Worker for caching and offline support */
const CACHE_VERSION = 'v1-' + (self.crypto?.randomUUID?.() || Date.now());
const CACHE_NAME = `medical-pump-cache-${CACHE_VERSION}`;

self.addEventListener('install', (event) => {
  // Skip waiting so the SW activates immediately on first load
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim clients so pages start being controlled without reload
  event.waitUntil(
    (async () => {
      // Cleanup old caches
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith('medical-pump-cache-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // For navigations (HTML pages): network-first, fallback to cache
  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req));
    return;
  }

  // For static assets: cache-first
  const dest = req.destination;
  if (['style', 'script', 'image', 'font'].includes(dest)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Default: try network, fallback to cache
  event.respondWith(networkFirst(req));
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const fresh = await fetch(request);
    // Only cache valid responses
    if (fresh && fresh.ok && request.method === 'GET' && !request.url.includes('/__')) {
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch (e) {
    const cached = await cache.match(request);
    if (cached) return cached;
    // As a last resort, return a generic Response
    return new Response('You appear to be offline.', { status: 503, statusText: 'Offline' });
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  if (fresh && fresh.ok && request.method === 'GET') {
    cache.put(request, fresh.clone());
  }
  return fresh;
}
