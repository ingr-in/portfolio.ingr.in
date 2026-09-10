"use strict";

const CACHE_NAME = "ingr-portfolio-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",

  "./assets/css/style.css",
  "./assets/js/script.js",

  "./assets/icons/icon.svg",

  "./pages/home.html",
  "./pages/about.html",
  "./pages/projects.html",
  "./pages/skills.html",
  "./pages/contact.html"
];


self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches.open(CACHE_NAME)
        .then(cache => {

          return cache.addAll(
            APP_FILES
          );

        })

    );

    self.skipWaiting();

  }
);


self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches.keys()
        .then(keys => {

          return Promise.all(

            keys
              .filter(
                key => key !== CACHE_NAME
              )
              .map(
                key => caches.delete(key)
              )

          );

        })

    );

    self.clients.claim();

  }
);


self.addEventListener(
  "fetch",
  event => {

    const request =
      event.request;

    if (request.method !== "GET") {
      return;
    }

    event.respondWith(

      caches.match(request)
        .then(cachedResponse => {

          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request)
            .then(response => {

              if (
                !response ||
                response.status !== 200 ||
                response.type === "opaque"
              ) {
                return response;
              }

              const copy =
                response.clone();

              caches.open(CACHE_NAME)
                .then(cache => {

                  cache.put(
                    request,
                    copy
                  );

                });

              return response;

            })
            .catch(() => {

              return caches.match(
                "./index.html"
              );

            });

        })

    );

  }
);
