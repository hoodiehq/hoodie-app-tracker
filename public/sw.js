var urlsToCache = [
  '/',
  'assets/js/account.js',
  'assets/js/common.js',
  'assets/js/index.js',
  'assets/app.css',
  'hoodie/client.js',
  'logging.js',
  'about.html',
  'account.html'
];

// Add here everything that needs to be done as the ServiceWorker
// install.
// The installation only happens once, when the browsers sees this
// version of the ServiceWorker for the first time.
self.addEventListener('install', function(event) {
  // Make sure that new versions of the ServiceWorker are activated
  // inmediately, without waiting for page reload.
  event.waitUntil(self.skipWaiting());
  // Open a cache to store the needed assets
  event.waitUntil(
    caches.open('simple-sw-v1').then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});


// The fetch event happens for the page request with the
// ServiceWorker's scope, and any request made within that
// page.
self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Is there something in the cache that matches the request?
    // Return it!
    // Otherwise pass the request to the request to `fetch`,
    // which will use the network.
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

// The activate event happens when a new ServiceWorker is activated,
// by default when loading a new page or reloading an existent one.
self.addEventListener('activate', function(event) {
  // Make sure that new versions of the ServiceWorker are used for
  // all tabs inmediately, without the need of reload
  event.waitUntil(self.clients.claim());
});
