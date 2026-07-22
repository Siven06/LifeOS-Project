const CACHE_NAME = 'lifeos-v1';
const STATIC_CACHE = 'lifeos-static-v1';
const DYNAMIC_CACHE = 'lifeos-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/utils.js',
  '/js/i18n.js',
  '/js/api.js',
  '/js/components/toast.js',
  '/js/components/transactionModal.js',
  '/js/router.js',
  '/js/screens/auth.js',
  '/js/screens/dashboard.js',
  '/js/screens/transactions.js',
  '/js/screens/budgets.js',
  '/js/screens/goals.js',
  '/js/screens/debts.js',
  '/js/screens/alerts.js',
  '/js/screens/profile.js',
  '/js/app.js',
  '/images/logo_lifeos.png',
  '/manifest.json',
  'https://cdn.tailwindcss.com?plugins=forms,container-queries',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400&display=swap'
];

const API_CACHE_NAME = 'lifeos-api-v1';
const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { credentials: 'same-origin' })));
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== API_CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.origin === location.origin && url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  if (STATIC_ASSETS.some(asset => request.url.includes(asset.replace('/', '')))) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

async function cacheFirstStrategy(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for static asset:', request.url);
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

async function networkFirstStrategy(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      const cacheEntry = {
        response: responseToCache,
        timestamp: Date.now()
      };
      await cache.put(request, new Response(JSON.stringify(cacheEntry)));
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for API, trying cache:', request.url);
    
    const cachedEntry = await cache.match(request);
    if (cachedEntry) {
      const data = await cachedEntry.json();
      const age = Date.now() - data.timestamp;
      
      if (age < API_CACHE_DURATION) {
        return new Response(JSON.stringify(data.response), {
          headers: { 'Content-Type': 'application/json', 'X-Served-By': 'service-worker' }
        });
      } else {
        await cache.delete(request);
      }
    }
    
    return new Response(
      JSON.stringify({ error: 'Offline', message: 'No hay conexión y no hay datos en caché' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});

async function syncTransactions() {
  console.log('[SW] Background sync: syncing transactions');
}