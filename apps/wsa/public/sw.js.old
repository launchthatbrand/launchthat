// Service Worker for WSA Learning Platform
const CACHE_NAME = "wsa-app-v1";

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/login",
  "/downloads",
  "/offline.html",
  "/favicon.ico",
  "/manifest.json",
];

// Install event - cache all static assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");

  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => {
        console.error("[Service Worker] Cache error:", err);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");

  // Take control of all clients immediately
  event.waitUntil(clients.claim());

  // Remove old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", name);
            return caches.delete(name);
          }
        }),
      );
    }),
  );
});

// Fetch event - serve from cache first, then network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests and browser extensions
  if (
    event.request.method !== "GET" ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  // Skip API and API-like requests (dynamic data)
  if (
    event.request.url.includes("/api/") ||
    event.request.url.includes("/trpc/") ||
    event.request.url.includes("/sso-callback")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise fetch from network
      return fetch(event.request)
        .then((response) => {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response to cache it
          const responseToCache = response.clone();

          // Cache the new resource
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch((err) => {
          // Network failure, check if it's a navigation request
          console.error("[Service Worker] Fetch error:", err);

          if (event.request.mode === "navigate") {
            return caches.match("/offline.html");
          }

          return new Response("Network error", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          });
        });
    }),
  );
});

// Listen for messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
