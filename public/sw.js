// This file allows your app to be cached and work offline using the ServiceWorker standard
// For more info and list of web browser support visit:
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Browser_compatibility

// If at any point you want to force pages that use this ServiceWorker to start using a fresh
// cache, then increment the CACHE_VERSION value. It will kick off the ServiceWorker update
// flow and the old cache will be purged as part of the activate event handler when the
// updated ServiceWorker is activated
var CACHE_VERSION = 3

var CURRENT_CACHE = 'dependencies-cache-v' + CACHE_VERSION

// Files required to make this app work offline
var REQUIRED_FILES = [
  '/',
  'about.html',
  'account.html',
  'index.html',
  'sw.js',
  'assets/favicon.ico',
  'assets/app.css',
  'assets/hoodie-camp.png',
  'assets/low-profile-dog.png',
  'assets/js/a11y-announce.js',
  'assets/js/account.js',
  'assets/js/start-service-worker.js',
  'assets/js/common.js',
  'assets/js/index.js',
  'assets/js/lie.js',
  '/hoodie/client.js'
]

// 'install' is fired once per ServiceWorker version, this happens
// when the browser sees this version of the ServiceWorker for the first time
self.addEventListener('install', function (event) {
  // All of these logging statements should be visible via the "Inspect" interface
  // for the relevant ServiceWorker accessed via chrome://serviceworker-internals
  console.log('[install] Handling install event. Resources to cache:', REQUIRED_FILES)

  event.waitUntil(
    caches.open(CURRENT_CACHE)
      .then(function (cache) {
        console.log('[install] Cache opened, adding all core components to cache')
        return cache.addAll(REQUIRED_FILES)
      })
      .then(function () {
        console.log('[install] All required resources have been cached!')
        return self.skipWaiting()
      })
      .catch(function (error) {
        console.log('[install] Resources caching failed with error: ', error)
      })
  )
})

self.addEventListener('activate', function (event) {
  console.log('[activate] Activating ServiceWorker!')

  event.waitUntil(
    caches.keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheName !== CURRENT_CACHE) {
              // If this cache is name different than our current cache, then delete it
              console.log('[activate] Deleting out of date cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(function () {
        // We immediately claim the ServiceWorker so that the user doesn't need to refresh the page
        // to activate the ServiceWorker
        console.log('[activate] Claiming this ServiceWorker')
        self.clients.claim()
      })
  )
})

// The fetch event happens for the page request with the
// ServiceWorker's scope, and any request made within that
// page
self.addEventListener('fetch', function (event) {
  console.log('[fetch] Handling fetch event for', event.request.url)

  event.respondWith(
    // caches.match() will look for a cache entry in the ServiceWorker cache.
    // Is there something there that matches the request?
    // Return it!
    // Otherwise return the result from the live server.
    // `fetch` is essentially a "fallback".
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return the response from the cached version
        if (response) {
          console.log('[fetch] Returning from ServiceWorker cache: ', event.request.url)

          return response
        }

        console.log('[fetch] No response found in cache. About to fetch from network ', event.request.url)

        return fetch(event.request)
          .catch(function (error) {
            // This catch() will handle exceptions thrown from the fetch() operation.
            // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
            // It will return a normal response object that has the appropriate error code set.
            console.error('[fetch] Live fetching failed with error:', error)

            throw error
          })
      })
  )
})
/* global self caches fetch */
