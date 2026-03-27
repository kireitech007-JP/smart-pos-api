// Service Worker for Smart Retail POS
// Enable offline capability and PWA features

const CACHE_NAME = 'smart-retail-pos-v1';
const STATIC_CACHE_NAME = 'smart-retail-pos-static-v1';
const DYNAMIC_CACHE_NAME = 'smart-retail-pos-dynamic-v1';

// Files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  // Add your static assets here
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Handle API requests (Supabase, Google Scripts)
  if (event.request.url.includes('/rest/v1/') || 
      event.request.url.includes('/macros/s/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Return cached response if available
          return caches.match(event.request);
        })
    );
    return;
  }

  // Handle static assets
  if (event.request.destination === 'static' || 
      event.request.destination === 'image' ||
      event.request.destination === 'script' ||
      event.request.destination === 'style') {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Cache new static assets
          return fetch(event.request)
            .then((response) => {
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              const responseToCache = response.clone();
              caches.open(DYNAMIC_CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            });
        })
    );
    return;
  }

  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) {
            // Return offline page or index.html for SPA
            return caches.match('/index.html');
          }
          return response;
        })
        .catch(() => {
          // Return cached index.html when offline
          return caches.match('/index.html');
        })
    );
    return;
  }

  // Default: try network first, then cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // Return cached version if available
        return caches.match(event.request);
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
  if (event.tag === 'sync-backup') {
    event.waitUntil(syncBackup());
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from Smart Retail POS',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Smart Retail POS', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sync transactions when back online
async function syncTransactions() {
  try {
    // Get offline transactions from IndexedDB
    const offlineTransactions = await getOfflineTransactions();
    
    // Sync each transaction to server
    for (const transaction of offlineTransactions) {
      try {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(transaction)
        });
        
        // Remove from offline storage after successful sync
        await removeOfflineTransaction(transaction.id);
      } catch (error) {
        console.error('Failed to sync transaction:', error);
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Sync backup when back online
async function syncBackup() {
  try {
    // Get offline backup data from IndexedDB
    const offlineBackup = await getOfflineBackup();
    
    if (offlineBackup) {
      await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(offlineBackup)
      });
      
      // Clear offline backup after successful sync
      await clearOfflineBackup();
    }
  } catch (error) {
    console.error('Backup sync failed:', error);
  }
}

// IndexedDB helpers (simplified)
async function getOfflineTransactions() {
  // Implement IndexedDB logic for offline transactions
  return [];
}

async function removeOfflineTransaction(id) {
  // Implement IndexedDB logic to remove transaction
}

async function getOfflineBackup() {
  // Implement IndexedDB logic for offline backup
  return null;
}

async function clearOfflineBackup() {
  // Implement IndexedDB logic to clear backup
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'periodic-backup') {
    event.waitUntil(periodicBackup());
  }
});

// Periodic backup function
async function periodicBackup() {
  try {
    // Perform automatic backup to cloud
    const response = await fetch('/api/backup/auto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('Periodic backup successful');
    }
  } catch (error) {
    console.error('Periodic backup failed:', error);
  }
}

// Message handler for communication with app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
