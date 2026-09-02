/*
 * Safe Yatri AI — offline service worker
 * ---------------------------------------
 * Two jobs:
 *
 * 1. Cache-first the OpenStreetMap tile requests the escape map
 *    makes, so tiles already seen (either from normal browsing or
 *    from the "Download Offline Map" button) are served instantly
 *    from Cache Storage — with no network request at all — and the
 *    map still renders (instead of showing broken/placeholder
 *    tiles) when there's no connection.
 *
 * 2. Cache the core app shell (the HTML/CSS/JS + the Leaflet
 *    library it depends on) so the page itself can still open on a
 *    flaky or offline connection, not just the map inside it.
 */

const VERSION = "v3";
const SHELL_CACHE = "safeyatri-shell-" + VERSION;
const TILE_CACHE = "safeyatri-tiles-" + VERSION;

const SHELL_URLS = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/voice-assistant.js",
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
];

/* A small inline placeholder shown only if a tile has never been
   cached and there truly is no network to fetch it from. */
const OFFLINE_TILE_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">' +
    '<rect width="256" height="256" fill="#11151c"/>' +
    '<text x="50%" y="50%" fill="#475569" font-size="13" ' +
    'font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">' +
    "Not downloaded yet</text></svg>";

self.addEventListener("install", event => {

    event.waitUntil(
        caches
            .open(SHELL_CACHE)
            .then(cache =>
                Promise.all(
                    SHELL_URLS.map(url =>
                        cache.add(url).catch(() => {
                            /* A single CDN hiccup shouldn't block install. */
                        })
                    )
                )
            )
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {

    event.waitUntil(
        caches
            .keys()
            .then(names =>
                Promise.all(
                    names
                        .filter(
                            name =>
                                name !== SHELL_CACHE &&
                                name !== TILE_CACHE
                        )
                        .map(name => caches.delete(name))
                )
            )
            .then(() => self.clients.claim())
    );
});

function isTileRequest(url) {
    return /(^|\.)tile\.openstreetmap\.org$/.test(url.hostname);
}

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    if (isTileRequest(url)) {

        event.respondWith(
            caches.open(TILE_CACHE).then(async cache => {

                const cached = await cache.match(event.request);
                if (cached) return cached;

                try {

                    const response = await fetch(event.request);

                    /*
                     * Plain <img> tile requests (no CORS) come back
                     * as "opaque" responses — status is always 0 and
                     * response.ok is always false even when the
                     * fetch actually succeeded, so opaque responses
                     * are cached too, not just response.ok ones.
                     */
                    if (
                        response &&
                        (response.ok || response.type === "opaque")
                    ) {
                        cache.put(event.request, response.clone());
                    }

                    return response;

                } catch (err) {

                    return new Response(OFFLINE_TILE_SVG, {
                        headers: { "Content-Type": "image/svg+xml" }
                    });
                }
            })
        );

        return;
    }

    /* App shell + same-origin files / known CDN assets:
       serve cached instantly, refresh the cache in the background. */
    event.respondWith(
        caches.match(event.request).then(cached => {

            const networkFetch = fetch(event.request)
                .then(response => {

                    if (
                        response &&
                        (response.ok || response.type === "opaque")
                    ) {
                        caches
                            .open(SHELL_CACHE)
                            .then(cache =>
                                cache.put(event.request, response.clone())
                            );
                    }

                    return response;
                })
                .catch(() => cached);

            return cached || networkFetch;
        })
    );
});
