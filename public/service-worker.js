const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/db.js",
  "/index.js",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
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
  