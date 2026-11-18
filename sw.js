const CACHE = 'clinic-calc-v3';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll([
      './',
      './index.html',
      './manifest.json',
      './icon-192.svg'
    ]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => k !== CACHE ? caches.delete(k) : null)
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Monetag + onno ad network ke kokhono cache korba na
  if (
    url.includes('monetag') ||
    url.includes('alcap') ||
    url.includes('googlesyndication') ||
    url.includes('doubleclick') ||
    url.includes('ads')
  ) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Bahirer kono file cache korba na, sudhu tomar site er file
  if (!url.startsWith(self.location.origin)) {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});