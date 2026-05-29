var CACHE='mundial2026-v37';
var URLS=['./', './index.html', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(URLS);}));
  self.skipWaiting();
});

self.addEventListener('message', function(e){
  if(e.data&&e.data.type==='SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(names){
    return Promise.all(names.filter(function(n){return n!==CACHE;}).map(function(n){return caches.delete(n);}));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  var url=e.request.url;
  if(url.indexOf('flagcdn.com')>=0){
    e.respondWith(caches.match(e.request).then(function(r){
      if(r) return r;
      return fetch(e.request).then(function(resp){
        if(resp.ok){var clone=resp.clone();caches.open(CACHE).then(function(c){c.put(e.request,clone);});}
        return resp;
      }).catch(function(){return new Response('',{status:404});});
    }));
  }
  else if(e.request.mode==='navigate'||url.indexOf('.html')>=0||url.endsWith('/')){
    e.respondWith(fetch(e.request).then(function(resp){
      if(resp.ok){var clone=resp.clone();caches.open(CACHE).then(function(c){c.put(e.request,clone);});}
      return resp;
    }).catch(function(){return caches.match(e.request);}));
  }
  else {
    e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request);}));
  }
});
