const CACHE = 'adi-cache-v1';
const ASSETS = [
  '/',
  '/client/App.tsx',
  '/placeholder.svg',
  '/manifest.webmanifest'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then((res) => res || fetch(req).then((netRes) => {
      const copy = netRes.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return netRes;
    }).catch(() => res))
  );
});
