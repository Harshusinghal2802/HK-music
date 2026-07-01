const CACHE_NAME = "hkmusic-cache-v1";
const urlsToCache = ["/", "/index.html", "/manifest.json", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (url.includes("/api/") || url.includes("cloudinary")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request)
          .then((fetchRes) => {
            return caches.open(CACHE_NAME).then((cache) => {
              if (event.request.method === "GET") {
                cache.put(event.request, fetchRes.clone());
              }
              return fetchRes;
            });
          })
          .catch(() => caches.match("/index.html"))
      );
    })
  );
});
