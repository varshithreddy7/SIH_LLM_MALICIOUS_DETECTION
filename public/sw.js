const CACHE = 'adi-cache-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/placeholder.svg',
  '/manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Only cache same-origin known ASSETS; avoid caching Vite dev modules and node_modules
  if (url.origin !== self.location.origin) return;
  if (!ASSETS.includes(url.pathname)) return;

  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((netRes) => {
          const copy = netRes.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return netRes;
        })
        .catch(() => cached);
    })
  );
});
