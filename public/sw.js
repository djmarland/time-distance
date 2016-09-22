var VERSION = 1,
    CACHE_NAME = 'page-cache-' + VERSION,
    urlsToCache = [
        './',
        'static/dist/vendor.js'
    ];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key != CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function(response) {
                        return response;
                    });
            });
        })
    );
});
