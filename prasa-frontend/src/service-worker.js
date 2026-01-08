/* eslint-disable no-restricted-globals */

import { precacheAndRoute } from 'workbox-precaching';

// CRA build injects manifest here automatically
precacheAndRoute(self.__WB_MANIFEST);

// fallback runtime cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request);
    })
  );
});

// activate immediately
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
