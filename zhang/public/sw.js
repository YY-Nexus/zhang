// Service Worker for PWA
const CACHE_NAME = 'zhang-wedding-v2.0';
const OFFLINE_URL = '/offline.html';

// 需要缓存的核心资源
const CORE_ASSETS = [
  '/',
  '/offline.html',
  '/yyc3-pwa-icon.png',
  '/yyc3-logo-blue.png',
  '/yyc3-logo-white.png',
  '/yyc3-logo-black.png',
];

// 安装事件 - 缓存核心资源
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching core assets');
      return cache.addAll(CORE_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 请求拦截 - 网络优先，缓存备用策略
self.addEventListener('fetch', (event) => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;

  // 跳过跨域请求
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 克隆响应以便缓存
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      })
      .catch(() => {
        // 网络失败，尝试从缓存获取
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          
          // 如果是导航请求且缓存中没有，返回离线页面
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          
          return new Response('离线状态，资源不可用', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
      })
  );
});

// 消息事件 - 用于跳过等待
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

