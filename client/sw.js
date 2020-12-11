self.addEventListener('install', e => {
	e.waitUntil(
		caches.open('static')
		.then(cache => 
			cache.addAll(['./', './main.css', './main.js', './Card.js', './bkg.jpg', './loadanim.css', './icon.png'])
		)
	);
});

self.addEventListener('fetch', e =>
	e.respondWith(async () => {
		try {
			return await fetch(e.request)
		} catch {
			return caches.match(e.request);
		}
	})
);