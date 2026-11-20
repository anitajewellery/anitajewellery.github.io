const CACHE = "anita-jewellery-v9";
const IMG_CACHE = "anita-images-v1";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== IMG_CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // App shell: network-first, so a redesign reaches returning visitors on
  // their next visit; the cache is only the offline fallback.
  if (url.origin === location.origin) {
    e.respondWith((async () => {
      try {
        const res = await fetch(e.request);
        if (res && res.status === 200) {
          const cache = await caches.open(CACHE);
          cache.put(e.request, res.clone());
        }
        return res;
      } catch (err) {
        const hit = await caches.match(e.request);
        if (hit) return hit;
        throw err;
      }
    })());
    return;
  }
  // Product photos (Drive thumbnails): cache-first — a photo's URL only changes when the photo does.
  if (url.hostname === "drive.google.com" || url.hostname.endsWith("googleusercontent.com")) {
    e.respondWith(caches.open(IMG_CACHE).then(async cache => {
      const hit = await cache.match(e.request);
      if (hit) return hit;
      const res = await fetch(e.request);
      if (res && (res.status === 200 || res.type === "opaque")) cache.put(e.request, res.clone());
      return res;
    }));
  }
  // Everything else (Apps Script data): network.
});
