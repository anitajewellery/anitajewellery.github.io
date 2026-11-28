const CACHE = "anita-admin-v17
const IMG_CACHE = "anita-admin-images-v1";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== IMG_CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
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
});
