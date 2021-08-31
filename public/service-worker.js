const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/index.js',
    '/style.css',
    "/db.js",
    //"https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    //"https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/manifest.json"
  ];
  
  const PRECACHE = 'applicationcache-v1';
  const RUNTIME = 'runtime';
  
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches
        .open(PRECACHE)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
        //.then(self.skipWaiting())
    );
  });
  
  
  self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith("/api/")) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
  
          return caches.open(RUNTIME).then((cache) => {
            return fetch(event.request).then((response) => {
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    }
  });
  