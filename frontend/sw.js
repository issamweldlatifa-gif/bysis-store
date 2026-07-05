/* =================================================================
   Bysis — Service Worker
   Strategy:
   - precache the app shell (this HTML + icons + manifest)
   - cache-first for same-origin assets
   - stale-while-revalidate for cross-origin images (Unsplash)
   - network-first for everything else, fallback to cache
   ================================================================= */

const CACHE_VERSION = 'bysis-v1';
const APP_SHELL = [
    './index.html',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-512.png'
];

// --- Install: precache the app shell ---
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => cache.addAll(APP_SHELL).catch(() => {}))
            .then(() => self.skipWaiting())
    );
});

// --- Activate: clean up old caches ---
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

// --- Fetch: routing strategy ---
self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);

    // Navigation requests → network-first, fallback to cached app shell (offline)
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req).catch(() => caches.match('./index.html'))
        );
        return;
    }

    // Cross-origin images (Unsplash) → stale-while-revalidate
    if (url.origin !== self.location.origin && req.destination === 'image') {
        event.respondWith(
            caches.open(CACHE_VERSION + '-img').then(async (cache) => {
                const cached = await cache.match(req);
                const network = fetch(req).then((res) => {
                    if (res && res.status === 200) cache.put(req, res.clone());
                    return res;
                }).catch(() => cached);
                return cached || network;
            })
        );
        return;
    }

    // Same-origin assets → cache-first
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(req).then((cached) => cached || fetch(req).then((res) => {
                if (res && res.status === 200) {
                    const clone = res.clone();
                    caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone));
                }
                return res;
            }).catch(() => cached))
        );
        return;
    }

    // Default → try network, fallback to cache
    event.respondWith(fetch(req).catch(() => caches.match(req)));
});
