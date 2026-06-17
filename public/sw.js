/* Estética Pro — Service Worker
   Estratégias:
   - Navegações (HTML): network-first com fallback offline para o app shell.
   - Assets estáticos hasheados / ícones: cache-first.
   - Fontes/CDN (MDI): stale-while-revalidate.
*/
const VERSION = 'v1.0.0'
const SHELL_CACHE = `estetica-shell-${VERSION}`
const RUNTIME_CACHE = `estetica-runtime-${VERSION}`

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting()
})

function isStaticAsset(url) {
  return /\.(?:js|css|woff2?|ttf|eot|png|jpg|jpeg|svg|webp|gif|ico|json)$/i.test(url.pathname)
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Navegações SPA → network-first, fallback ao index.html em cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy))
          return res
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('/index.html')))
    )
    return
  }

  // CDN de fontes/ícones (MDI) → stale-while-revalidate
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request)
            .then((res) => { if (res.ok) cache.put(request, res.clone()); return res })
            .catch(() => cached)
          return cached || network
        })
      )
    )
    return
  }

  // Assets locais → cache-first
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached || fetch(request).then((res) => {
          const copy = res.clone()
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy))
          return res
        }).catch(() => cached)
      )
    )
  }
})
