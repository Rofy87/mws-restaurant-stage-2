const appCache = 'mws-static-cache-v1';
const imgsCache = 'mws-asset-cache-v1';
const urlsToCache = [
    '/',
    '/css/styles.css',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/js/dbhelper.js',
    '/js/idb.js',
    '/js/register_sw.js',
    '/data/restaurants.json',
    '/index.html',
    'restaurant.html'
];


self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(appCache).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});


self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);

    if (requestUrl.pathname.startsWith('/images/')) {
        event.respondWith(servePhoto(event.request));
        return;
    }
    event.respondWith(
        caches.match(event.request , { ignoreSearch:true }).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

function servePhoto(request) {

    return caches.open(imgsCache).then(function(cache) {
        return cache.match(request.url).then(function(response) {
            if (response) return response;

            return fetch(request).then(function(networkResponse) {
                cache.put(request.url, networkResponse.clone());
                return networkResponse;
            });
        });
    });
}
