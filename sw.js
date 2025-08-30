const CACHE_NAME = 'bible-scholar-quiz-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.tsx', // Caching the main entry point
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Inter:wght@400;500;700&display=swap'
];

// Install event: caches the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache, caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
          console.error('Failed to cache app shell:', err);
      })
  );
});

// Activate event: cleans up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: serves assets from cache, falling back to network, and caches new assets
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests and API calls
  if (event.request.method !== 'GET' || event.request.url.includes('generativelanguage')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If a cached response is found, return it.
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, fetch from the network.
      return fetch(event.request).then((networkResponse) => {
        // Clone the response because it's a stream and can be consumed only once.
        const responseToCache = networkResponse.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          // Add the new response to the cache.
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
