(function () {
  "use strict";

  var STORAGE_KEY = "theme";
  var root = document.documentElement;

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* ignore */
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.textContent = theme === "dark" ? "☀️" : "🌙";
      toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  function initTheme() {
    var stored = getStoredTheme();
    var theme = stored || (systemPrefersDark() ? "dark" : "light");
    applyTheme(theme);

    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
        var next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        setStoredTheme(next);
      });
    }
  }

  function markActiveNavLink() {
    var path = window.location.pathname.replace(/index\.html$/, "");
    document.querySelectorAll("nav.site-nav a").forEach(function (link) {
      var linkPath = link.getAttribute("href");
      if (!linkPath) return;
      if (linkPath === path || (linkPath !== "/" && path.indexOf(linkPath) === 0)) {
        link.classList.add("active");
      }
    });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("in-view");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    markActiveNavLink();
    initReveal();
  });
})();
