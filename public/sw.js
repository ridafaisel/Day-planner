const CACHE = 'day-planner-standalone-v1';
const CORE = ['/', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-maskable.png', '/icons/apple-touch-icon.png', '/favicon.svg'];
self.addEventListener('install', event => {
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(CORE);
  const page=await cache.match('/');const html=await page.text();
  const assets=[...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g)].map(m=>new URL(m[1],self.location.origin));
  const seen=new Set();
  const cacheAsset=async u=>{
   if(u.origin!==self.location.origin||seen.has(u.href))return;seen.add(u.href);
   const r=await fetch(u.href);if(!r.ok)throw new Error('Offline asset unavailable');
   await cache.put(u.href,r.clone());
   if(u.pathname.endsWith('.js')){
    const js=await r.text();
    const dependencies=[...js.matchAll(/["']([^"'\s]+\.js)["']/g)].map(m=>new URL(m[1].startsWith('_next/')?'/'+m[1]:m[1],u));
    await Promise.all(dependencies.map(cacheAsset));
   }
  };
  await Promise.all(assets.map(cacheAsset));
  await self.skipWaiting();
 })());
});
self.addEventListener('activate', event => {event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('day-planner-')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})())});
self.addEventListener('fetch', event => {
 const req=event.request,u=new URL(req.url);
 if(req.method!=='GET'||u.origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith((async()=>{try{const r=await fetch(req);if(r.ok&&(r.headers.get('content-type')||'').includes('text/html')&&!r.redirected){const c=await caches.open(CACHE);await c.put('/',r.clone())}return r}catch{const c=await caches.open(CACHE);return await c.match('/')||Response.error()}})());return;
 }
 if(!/\.(js|css|png|svg|webmanifest)$/.test(u.pathname))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(req);if(cached)return cached;const r=await fetch(req);if(r.ok)await cache.put(req,r.clone());return r})());
});
