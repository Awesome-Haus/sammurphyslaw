/* Murphy's Law (Rectified) — scroll reveals + hero load + toast flip */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- topbar border once scrolled ---- */
  var topbar = document.querySelector(".topbar");
  function onScroll() {
    if (!topbar) return;
    topbar.classList.toggle("stuck", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- reveal on enter view ---- */
  var revealEls = document.querySelectorAll("[data-reveal]");

  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.28, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- hero plays on load (slight delay so fonts settle) ---- */
  var hero = document.querySelector(".hero");
  if (hero) {
    setTimeout(function () { hero.classList.add("in"); }, 200);
  }

  /* ---- "show more" toggle for the oversized book (Technology) ---- */
  document.querySelectorAll(".more-btn").forEach(function (btn) {
    var laws = document.getElementById(btn.getAttribute("aria-controls"));
    if (!laws) return;
    var txt = btn.querySelector(".more-btn__txt");
    btn.addEventListener("click", function () {
      laws.classList.toggle("is-collapsed");
      var collapsed = laws.classList.contains("is-collapsed");
      btn.setAttribute("aria-expanded", String(!collapsed));
      if (txt) txt.textContent = btn.getAttribute(collapsed ? "data-more" : "data-less");
      if (!collapsed) {
        /* reveal the laws that were hidden (IntersectionObserver skipped them) */
        laws.querySelectorAll(".law--more").forEach(function (el) { el.classList.add("in"); });
      } else {
        /* on collapse, return to the button so the reader isn't stranded down-page */
        btn.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
      }
    });
  });
})();
