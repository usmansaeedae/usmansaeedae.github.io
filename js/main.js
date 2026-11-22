/* Dr Muhammad Usman Saeed Akhtar — portfolio behaviour
   Progressive enhancement only: every page works with JavaScript disabled. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var safeStore = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  /* ---------- Theme toggle (initial theme is set inline in <head>) ---------- */
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    var syncLabel = function () {
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      toggle.setAttribute("aria-label", "Switch to " + (dark ? "light" : "dark") + " mode");
    };
    syncLabel();
    toggle.addEventListener("click", function () {
      var root = document.documentElement;
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      safeStore.set("theme", next);
      syncLabel();
    });
  }

  /* ---------- Header: transparent over the home hero until scrolled ---------- */
  var header = document.querySelector(".site-header");
  if (header && header.classList.contains("is-over")) {
    var onHeaderScroll = function () { header.classList.toggle("scrolled", window.scrollY > 40); };
    window.addEventListener("scroll", onHeaderScroll, { passive: true });
    onHeaderScroll();
  }

  /* ---------- Mobile navigation ---------- */
  var burger = document.querySelector(".nav-burger");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  /* ---------- Dropdown submenus ---------- */
  var closeAllSubs = function () {
    document.querySelectorAll(".has-sub.open").forEach(function (o) {
      o.classList.remove("open");
      var b = o.querySelector(".sub-toggle");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  };
  document.querySelectorAll(".has-sub").forEach(function (item) {
    var btn = item.querySelector(".sub-toggle");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = item.classList.contains("open");
      closeAllSubs();
      item.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
    if (window.matchMedia("(min-width: 1081px) and (hover: hover)").matches) {
      item.addEventListener("mouseenter", function () { item.classList.add("open"); btn.setAttribute("aria-expanded", "true"); });
      item.addEventListener("mouseleave", function () { item.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); });
    }
  });
  document.addEventListener("click", closeAllSubs);

  /* ---------- Hero background video ---------- */
  var heroVideo = document.querySelector(".hero-video video");
  var videoToggle = document.querySelector(".video-toggle");
  if (heroVideo) {
    var setToggle = function (playing) {
      if (!videoToggle) return;
      videoToggle.setAttribute("aria-pressed", playing ? "false" : "true");
      videoToggle.querySelector(".vt-label").textContent = playing ? "Pause video" : "Play video";
      videoToggle.querySelector(".vt-pause").style.display = playing ? "" : "none";
      videoToggle.querySelector(".vt-play").style.display = playing ? "none" : "";
    };
    var userPaused = reduceMotion || safeStore.get("heroVideo") === "paused";
    if (userPaused) {
      heroVideo.removeAttribute("autoplay");
      heroVideo.pause();
      setToggle(false);
    } else {
      var p = heroVideo.play();
      if (p && p.catch) p.catch(function () { setToggle(false); });
      setToggle(true);
    }
    if (videoToggle) {
      videoToggle.addEventListener("click", function () {
        if (heroVideo.paused) { heroVideo.play(); userPaused = false; safeStore.set("heroVideo", "playing"); setToggle(true); }
        else { heroVideo.pause(); userPaused = true; safeStore.set("heroVideo", "paused"); setToggle(false); }
      });
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (userPaused) return;
          if (en.isIntersecting) heroVideo.play().catch(function () {});
          else heroVideo.pause();
        });
      }, { threshold: 0.05 }).observe(heroVideo);
    }
  }

  /* ---------- Simulation demos: play while on screen, click to pause ---------- */
  var demos = Array.prototype.slice.call(document.querySelectorAll("video[data-demo]"));
  demos.forEach(function (v) {
    v.muted = true;
    v.userPaused = reduceMotion;
    v.setAttribute("tabindex", "0");
    v.setAttribute("title", "Click to pause or play");
    if (reduceMotion) { v.controls = true; v.preload = "metadata"; }
    var toggle = function () {
      if (v.paused) { v.userPaused = false; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
      else { v.userPaused = true; v.pause(); }
    };
    if (!reduceMotion) {
      v.addEventListener("click", toggle);
      v.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(); } });
    }
  });
  if (demos.length && !reduceMotion) {
    if ("IntersectionObserver" in window) {
      var dio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.isIntersecting && !v.userPaused) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () { v.controls = true; }); }
          else if (!en.isIntersecting) v.pause();
        });
      }, { threshold: 0.25 });
      demos.forEach(function (v) { dio.observe(v); });
    } else {
      demos.forEach(function (v) { v.play(); });
    }
  }

  /* ---------- Inline film players (poster + play button) ---------- */
  document.querySelectorAll("[data-inline-video]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var frame = btn.parentElement;
      var v = document.createElement("video");
      v.src = btn.getAttribute("data-inline-video");
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      var poster = frame.querySelector("img");
      if (poster) v.poster = poster.getAttribute("src");
      frame.innerHTML = "";
      frame.appendChild(v);
      v.focus();
      var pr = v.play();
      if (pr && pr.catch) pr.catch(function () {});
    });
  });

  /* ---------- Lightbox for photos and clips ---------- */
  var lbItems = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (lbItems.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Media viewer");
    lb.innerHTML =
      '<button class="lb-btn lb-close" aria-label="Close viewer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<button class="lb-btn lb-prev" aria-label="Previous"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<button class="lb-btn lb-next" aria-label="Next"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '<figure><div class="lb-media"></div><figcaption></figcaption></figure>';
    document.body.appendChild(lb);
    var media = lb.querySelector(".lb-media");
    var cap = lb.querySelector("figcaption");
    var current = -1, lastFocus = null;

    var visibleItems = function () {
      return lbItems.filter(function (el) { return el.offsetParent !== null; });
    };
    var show = function (el) {
      var list = visibleItems();
      current = list.indexOf(el);
      media.innerHTML = "";
      var vid = el.getAttribute("data-video");
      if (vid) {
        var v = document.createElement("video");
        v.src = vid; v.controls = true; v.autoplay = true; v.playsInline = true; v.setAttribute("playsinline", "");
        if (el.getAttribute("data-poster")) v.poster = el.getAttribute("data-poster");
        media.appendChild(v);
      } else {
        var img = document.createElement("img");
        img.src = el.getAttribute("data-full");
        img.alt = el.getAttribute("data-alt") || "";
        media.appendChild(img);
      }
      cap.textContent = el.getAttribute("data-caption") || "";
      var multi = list.length > 1;
      lb.querySelector(".lb-prev").style.display = multi ? "" : "none";
      lb.querySelector(".lb-next").style.display = multi ? "" : "none";
    };
    var open = function (el) {
      lastFocus = document.activeElement;
      show(el);
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
      lb.querySelector(".lb-close").focus();
    };
    var close = function () {
      lb.classList.remove("open");
      media.innerHTML = "";
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };
    var step = function (d) {
      var list = visibleItems();
      if (!list.length) return;
      current = (current + d + list.length) % list.length;
      show(list[current]);
    };
    lbItems.forEach(function (el) {
      el.addEventListener("click", function (e) { e.preventDefault(); open(el); });
    });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { step(-1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { step(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab") { /* keep focus inside the viewer */
        var f = Array.prototype.slice.call(lb.querySelectorAll("button, video")).filter(function (n) { return n.offsetParent !== null; });
        if (!f.length) return;
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* ---------- Escape closes menus ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllSubs();
      if (document.body.classList.contains("nav-open")) {
        document.body.classList.remove("nav-open");
        if (burger) { burger.setAttribute("aria-expanded", "false"); burger.focus(); }
      }
    }
  });

  /* ---------- Counters: show final values (no count-up animation) ---------- */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    el.textContent = (el.getAttribute("data-prefix") || "") + el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
  });

  /* ---------- Skill bars ---------- */
  var bars = document.querySelectorAll(".skill-bar i[data-level]");
  if ("IntersectionObserver" in window && bars.length && !reduceMotion) {
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.style.width = en.target.getAttribute("data-level") + "%"; bio.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (el) { bio.observe(el); });
  } else {
    bars.forEach(function (el) { el.style.width = el.getAttribute("data-level") + "%"; });
  }

  /* ---------- Search + chip filtering (publications, projects, gallery) ---------- */
  var list = document.querySelector("[data-filter-list]");
  if (list) {
    var input = document.querySelector("[data-search]");
    var chips = document.querySelectorAll(".chip[data-filter]");
    var empty = document.querySelector(".no-results");
    var activeFilter = "all";
    var apply = function () {
      var q = input ? input.value.trim().toLowerCase() : "";
      var visible = 0;
      list.querySelectorAll("[data-tags]").forEach(function (item) {
        var tags = item.getAttribute("data-tags").toLowerCase();
        var text = item.textContent.toLowerCase();
        var show = (activeFilter === "all" || tags.split(/\s+/).indexOf(activeFilter) !== -1 || tags.indexOf(activeFilter) !== -1) && (!q || text.indexOf(q) !== -1);
        item.style.display = show ? "" : "none";
        if (show) visible++;
      });
      if (empty) empty.classList.toggle("show", visible === 0);
      document.body.classList.add("filtering");
    };
    if (input) input.addEventListener("input", apply);
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        chip.setAttribute("aria-pressed", "true");
        activeFilter = chip.getAttribute("data-filter");
        apply();
      });
    });
  }

  /* ---------- Contact form: opens the visitor's email app ---------- */
  var form = document.querySelector("form[data-compose-email]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var link = document.querySelector('a[href^="mailto:"]');
      var to = link ? link.getAttribute("href").replace(/^mailto:/, "").split("?")[0] : "";
      if (!to) return;
      var name = form.querySelector("[name=name]").value;
      var email = form.querySelector("[name=email]").value;
      var subject = form.querySelector("[name=subject]").value;
      var msg = form.querySelector("[name=message]").value;
      var body = msg + "\n\n" + name + "\n" + email;
      window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      var note = form.querySelector(".form-status");
      if (note) note.textContent = "Your email app should open with the message ready to send. If it does not, use the email address shown on this page.";
    });
  }

  /* ---------- Back to top ---------- */
  var btt = document.querySelector(".back-to-top");
  if (btt) {
    var onScroll = function () { btt.classList.toggle("show", window.scrollY > 700); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    btt.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });
  }

  /* ---------- Footer year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
