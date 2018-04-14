self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/index.html',
        '/preloader.gif',
        '/styles.css',
        '/data.json',
        '/home-icon.png',
        '/button.png',
        '/button-arrow.png',
        '/boot.js',
        '/core/app.js',
        '/core/router.js',
        '/utils/event-emitter.js',
        '/utils/date-formatter.js',
        '/core/page.js',
        '/pages/home.js',
        '/pages/search.js',
        '/pages/story.js',
        '/pages/not-found.js',
        '/ui/paranja.js',
        '/ui/spinner.js',
        '/ui/turbolink.js',
        '/components/storage.js',
        '/components/indexed-storage.js',
        '/components/search-field.js',
        '/components/navigation.js',
        '/components/headline.js',
        '/node_modules/systemjs/dist/system.js',
        '/node_modules/core-js/client/shim.min.js',
        '/node_modules/whatwg-fetch/fetch.js',
        '/node_modules/debug/browser.js',
        '/node_modules/debug/debug.js',
        '/node_modules/object-assign/index.js',
        '/node_modules/ms/index.js'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }

        var fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(
          function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();
            caches.open('v1')
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
