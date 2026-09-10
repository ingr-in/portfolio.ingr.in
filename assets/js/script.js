"use strict";

const app = document.getElementById("app");
const year = document.getElementById("year");

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

const pages = {
  home: "pages/home.html",
  about: "pages/about.html",
  projects: "pages/projects.html",
  skills: "pages/skills.html",
  contact: "pages/contact.html"
};


function getCurrentPage() {

  const hash = window.location.hash
    .replace("#", "")
    .trim()
    .toLowerCase();

  return pages[hash]
    ? hash
    : "home";
}


async function loadPage(name) {

  const page = pages[name] || pages.home;

  app.innerHTML = `
    <section class="loading-card">
      <div class="loader"></div>
      <p>Loading…</p>
    </section>
  `;

  try {

    const response = await fetch(page, {
      cache: "no-cache"
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    const html = await response.text();

    app.innerHTML = html;

    updateNavigation(name);

    document.title =
      `${capitalize(name)} | ingr.in`;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  } catch (error) {

    console.error(
      "Page loading error:",
      error
    );

    app.innerHTML = `
      <section class="content-card">
        <h1>Unable to load page</h1>

        <p>
          Please check your internet connection
          or try again.
        </p>

        <button
          class="button primary"
          type="button"
          onclick="loadPage('home')">
          Go Home
        </button>
      </section>
    `;

  }

}


function updateNavigation(activePage) {

  document
    .querySelectorAll(
      ".desktop-nav a, .mobile-menu a, .bottom-nav a"
    )
    .forEach(link => {

      const target =
        link.getAttribute("href")
          ?.replace("#", "")
          .toLowerCase();

      link.classList.toggle(
        "active",
        target === activePage
      );

    });

}


function capitalize(value) {

  return value.charAt(0).toUpperCase()
    + value.slice(1);

}


function closeMobileMenu() {

  mobileMenu?.classList.remove("open");

  menuButton?.setAttribute(
    "aria-expanded",
    "false"
  );

}


menuButton?.addEventListener(
  "click",
  () => {

    const opened =
      mobileMenu.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      String(opened)
    );

  }
);


document
  .querySelectorAll(
    ".mobile-menu a"
  )
  .forEach(link => {

    link.addEventListener(
      "click",
      closeMobileMenu
    );

  });


window.addEventListener(
  "hashchange",
  () => {

    loadPage(
      getCurrentPage()
    );

    closeMobileMenu();

  }
);


year.textContent =
  new Date().getFullYear();


loadPage(
  getCurrentPage()
);


/*
 * Service Worker
 */

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register("./sw.js")
        .then(registration => {

          console.log(
            "Service Worker registered:",
            registration.scope
          );

        })
        .catch(error => {

          console.warn(
            "Service Worker registration failed:",
            error
          );

        });

    }
  );

}
