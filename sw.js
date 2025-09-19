const CACHE_NAME = 'gst-calculator-cache-v1.1';
const ASSETS_TO_CACHE = [
  '/',
  'index.html',
  'manifest.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
  'screenshots/screenshot-desktop.png',
  'screenshots/screenshot-mobile.png',
  'screenshots/screenshot-pdf.png',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Teko:wght@400;700&family=Roboto+Slab:wght@400;700&family=Great+Vibes&family=Noto+Serif:wght@400;700&display=swap'
];

// Event: Install
// Caches all the essential assets for offline use.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Event: Activate
// Cleans up old caches to save space.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Event: Fetch
// Serves content from cache first (Cache-First strategy) for offline reliability.
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If the resource is in the cache, serve it from there.
        if (response) {
          return response;
        }
        
        // If not in cache, fetch from the network.
        return fetch(event.request)
          .then((networkResponse) => {
            // OPTIONAL: Clone the response and add it to the cache for next time.
            // This is useful for assets that are not in the initial cache list.
            let responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return networkResponse;
          });
      })
      .catch(() => {
        // If both cache and network fail (e.g., truly offline for a non-cached asset),
        // you could return a fallback offline page here if you had one.
      })
  );
});

// Event: Push (for Push Notifications)
// This is a placeholder. Full implementation requires a server and user permission.
self.addEventListener('push', (event) => {
  const title = 'GST Calc Update';
  const options = {
    body: event.data.text() || 'You have a new notification.',
    icon: 'icons/icon-192x192.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Event: Sync (for Background Sync)
// This is a placeholder. It allows tasks to be deferred until the user has a stable connection.
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
        console.log("Background sync event triggered. Handle data sync here.")
        // Example: syncUserData(); 
    );
  }
});

