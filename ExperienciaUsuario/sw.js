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
  "/assets/logoutng.webp" // Corrige la ruta
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Error al agregar recursos a la caché:", error);
      });
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
self.addEventListener("push", (event) => {
  console.log("SW evento push: ", event.data.text());
  const datos = JSON.parse(event.data.text());
  const titulo = datos.titulo;
  const opciones = {};
  event.waitUntil(self.registration.showNotification(titulo, opciones));
});
