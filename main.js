(function () {
  "use strict";

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  function initNav() {
    var nav = document.querySelector("[data-nav]");
    var toggle = document.querySelector("[data-nav-toggle]");
    var links = document.querySelector("[data-nav-links]");
    if (!nav || !toggle || !links) return;

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initSmoothAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navEl = document.querySelector("[data-nav]");
      var offset = navEl ? navEl.offsetHeight : 0;
      var top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: top,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      });
    });
  }

  function initReveals() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });

    items.forEach(function (el) { io.observe(el); });

    // Safety net: reveal anything still hidden after 6s
    setTimeout(function () {
      items.forEach(function (el) {
        if (!el.classList.contains("is-visible") && el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  function initNavShadowOnScroll() {
    var nav = document.querySelector("[data-nav]");
    if (!nav) return;
    var onScroll = function () {
      if (window.scrollY > 12) nav.style.boxShadow = "0 8px 24px -16px rgba(34,28,20,.4)";
      else nav.style.boxShadow = "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var HOTEL_WHATSAPP = "573165196399";

  function initBookingForm() {
    var form = document.querySelector("[data-booking-form]");
    if (!form) return;
    var note = form.querySelector("[data-form-note]");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      form.classList.add("is-sending");
      var data = new FormData(form);
      var mensaje =
        "Hola, quiero reservar en Hotel La Hermosa.\n" +
        "Nombre: " + data.get("nombre") + "\n" +
        "Entrada: " + data.get("checkin") + "\n" +
        "Salida: " + data.get("checkout") + "\n" +
        "Huéspedes: " + data.get("huespedes") + "\n" +
        "Habitación: " + data.get("habitacion") + "\n" +
        "Teléfono: " + data.get("telefono") + "\n" +
        "Mensaje: " + (data.get("mensaje") || "-");

      var url = "https://wa.me/" + HOTEL_WHATSAPP + "?text=" + encodeURIComponent(mensaje);
      window.open(url, "_blank", "noopener");

      if (note) {
        note.textContent = "Gracias, " + data.get("nombre") + ". Te llevamos a WhatsApp con tu solicitud lista para enviar.";
      }

      setTimeout(function () { form.classList.remove("is-sending"); }, 400);
    });
  }

  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  function boot() {
    safe(initNav, "initNav");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initReveals, "initReveals");
    safe(initNavShadowOnScroll, "initNavShadowOnScroll");
    safe(initBookingForm, "initBookingForm");
    safe(initYear, "initYear");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
