const CACHE = "schmid-karte-5";
const FILES = [
  "./index.html",
  "./sw.js",
  "./fonts/wix-display.woff2",
  "./fonts/wix-text-400.woff2",
  "./fonts/wix-text-500.woff2",
  "./fonts/wix-text-600.woff2",
  "./bilder/logo-black.png",
  "./bilder/logo-aehre.png",
  "./bilder/holm-cappuccino.jpg",
  "./bilder/holm-croissant.jpg",
  "./bilder/holm-fruehstueck.jpg",
  "./bilder/holm-lauge.jpg",
  "./bilder/holm-pflaume.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => {
        if (event.request.mode === "navigate") return caches.match("./index.html");
      });
    })
  );
});
