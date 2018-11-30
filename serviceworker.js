const CACHE_NAME = 'cache-v1';
const precacheResources = [
  '/',
  '/index.html',
  '/detail.html',
  '/css/bootstrap.min.css',
  '/css/templatemo-style.css',
  '/js/jquery-1.11.3.min.js',
  '/js/main.js',
  '/js/detail.js',
  '/js/tether.min.js',
  '/js/bootstrap.min.js',
  '/img/home/tm-home-img_ril7tl_c_scale,w_1400.jpg',
  '/img/classic-pattern-bg.png',
  '/img/image_placeholder.png',
  '/fallback.json',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      console.log('Service worker install event!');
      return cache.addAll(precacheResources);
    })
  );
});


self.addEventListener('activate', function(event) {
  //console.log('Service worker activate event!');
  event.waitUntil(
    caches.keys().then(function(cacheNames){
      return Promise.all(
        cacheNames.filter(function(cacheName){
          return cacheName != CACHE_NAME
        }).map(function(cacheName){
          return caches.delete(cacheName)
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request
  var url = new URL(request.url)

  //pisahkan request API dan internal
  if(url.origin === location.origin){
    event.respondWith(
      caches.match(request).then(function(response){
        return response || fetch(request)
      })
    )
  }else{
    event.respondWith(
      caches.open('wisata-cache').then(function(cache){
        return fetch(request).then(function(liveResponse){
          cache.put(request, liveResponse.clone())
          return liveResponse
        }).catch(function(){
          return caches.match(request).then(function(response){
            if(response) return response
              return caches.match('fallback.json')
          })
        })
      })
    )
  }
});
