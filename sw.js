// Service Worker for Mobil Helsedata PWA
const CACHE_NAME = 'mobil-helsedata-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/azure-app.js',
  '/manifest.json?v=3',
  '/icons/favicon.svg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache).catch((error) => {
          console.log('Cache addAll failed:', error);
          // Add files individually to avoid failing on missing files
          return Promise.all(
            urlsToCache.map(url => 
              cache.add(url).catch(err => 
                console.log(`Failed to cache ${url}:`, err)
              )
            )
          );
        });
      }).then(() => {
        console.log('Cache populated successfully');
        // Skip waiting and activate immediately
        return self.skipWaiting();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log('Found caches:', cacheNames);
      // Delete ALL caches to force complete refresh
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('All caches deleted - forcing complete refresh');
      // Force immediate update
      return self.clients.claim();
    })
  );
});

// Handle background sync for data collection
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // This would handle background data collection
  console.log('Background sync triggered');
  // Implementation would depend on specific data collection needs
}
