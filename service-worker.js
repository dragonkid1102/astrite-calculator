const CACHE_VERSION = "v1.0.0"; // ⬅️ ĐỔI VERSION MỖI LẦN UPDATE
const CACHE_NAME = `astrite-cache-${CACHE_VERSION}`;

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json"
];

// Cài đặt
self.addEventListener("install", event => {
  self.skipWaiting(); // ⬅️ nhận SW mới ngay
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Kích hoạt
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
  // 🚫 KHÔNG cache index.html → luôn lấy bản mới
  if (event.request.url.includes("index.html")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request);
    })
  );
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
