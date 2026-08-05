/**
 * ============================================================
 * Medical Digital Twin
 * Service Worker
 * Version : 1.0.0
 * ============================================================
 */

const CACHE_NAME = "mdt-cache-v1";

const APP_SHELL = [

    "/",
    "/index.html",
    "/manifest.json",

    "/assets/logo_128x128.png",

    "/css/reset.css",
    "/css/layout.css",
    "/css/app.css",
    "/css/components/header.css",
    "/css/components/bottomnav.css",
    "/css/components/cards.css",
    "/css/components/buttons.css",
    "/css/design/variables.css",
    "/css/design/animations.css"

];

/* ============================================================
 * Installation
 * ============================================================ */

self.addEventListener("install", event => {

    console.log("[SW] Installing...");

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))

    );

    self.skipWaiting();

});

/* ============================================================
 * Activation
 * ============================================================ */

self.addEventListener("activate", event => {

    console.log("[SW] Activated");

    event.waitUntil(

        caches.keys().then(keys =>

            Promise.all(

                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))

            )

        )

    );

    self.clients.claim();

});

/* ============================================================
 * Fetch
 * ============================================================ */

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

            .then(response => {

                if (response) {

                    return response;

                }

                return fetch(event.request)

                    .then(networkResponse => {

                        if (
                            event.request.method === "GET" &&
                            networkResponse.status === 200
                        ) {

                            const copy = networkResponse.clone();

                            caches.open(CACHE_NAME)
                                .then(cache => cache.put(event.request, copy));

                        }

                        return networkResponse;

                    })

                    .catch(() => {

                        return caches.match("/index.html");

                    });

            })

    );

});
