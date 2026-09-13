/* global self, caches, location, clients */
const CACHE = "balaji-arnod-v1";

self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.pathname.startsWith("/api")) return;
  e.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(e.request).then(
        (cached) =>
          cached ||
          fetch(e.request).then((res) => {
            if (res.ok && url.origin === location.origin) cache.put(e.request, res.clone());
            return res;
          })
      )
    )
  );
});
