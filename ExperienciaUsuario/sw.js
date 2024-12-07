const CACHE_NAME = "experiencia-usuario-cache-v1";
const urlsToCache = [
  "/",
  "/Accesibilidad.html",
  "/Carreras.html",
  "/dosExitos.html",
  "/Dudas.html",
  "/Exitos.html",
  "/Nosotros.html",
  "/Turismo.html",
  "/index.html",
  "/css/accesibilidad.css",
  "/css/Dudas.css",
  "/css/Exitos.css",
  "/css/ola.css",
  "/JS/Dudas.js",
  "/JS/app.js",
  "/JS/indexDb.js",
  "/assets/1.png",
  "/assets/2.png",
  "/assets/3.png",
  "/assets/4.png",
  "/assets/diseno.jpg",
  "/assets/turismo.jpg",
  "logoutng.webp"
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interceptar las solicitudes y servir archivos en caché
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Notificaciones
self.addEventListener("push", evento => {
    console.log("SW evento push: ", evento.data.text());
    const datos = JSON.parse(evento.data.text());
    const titulo = datos.titulo;
    const opciones = {};
    evento.waitUntil(self.registration.showNotification(titulo, opciones));
})
