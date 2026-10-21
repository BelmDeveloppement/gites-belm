/* Gîtes BEL'M — logique principale (langue, galeries, visite, réservation) */
(function () {
  "use strict";
  var C = window.BELM, D = window.I18N;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------------ */
  /* Langue                                                              */
  /* ------------------------------------------------------------------ */
  var SUPPORTED = ["fr", "en", "de", "nl"];
  var lang = "fr";

  function detectLang() {
    try { var s = localStorage.getItem("belm-lang"); if (SUPPORTED.indexOf(s) > -1) return s; } catch (e) {}
    var list = navigator.languages || [navigator.language || "fr"];
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i]).slice(0, 2).toLowerCase();
      if (SUPPORTED.indexOf(l) > -1) return l;
    }
    return "fr";
  }

  function t(key, vars) {
    var s = (D[lang] && D[lang][key]) || D.fr[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }

  function applyI18n() {
    document.documentElement.lang = lang;
    var tk = document.body.getAttribute("data-title");
    document.title = (!tk || tk === "meta.title") ? t("meta.title") : t(tk) + " — Gîtes BEL'M";
    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    $$("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":"); if (p.length === 2) el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });
    var sel = $("#langSelect"); if (sel) sel.value = lang;
  }

  function setLang(l, persist) {
    if (SUPPORTED.indexOf(l) < 0) l = "fr";
    lang = l;
    if (persist) { try { localStorage.setItem("belm-lang", l); } catch (e) {} }
    applyI18n();
    renderRates(); renderGalleryChips(); renderGallery(); renderTour(); renderGcal();
    renderCalendar(); updateEstimate(); updateFormMsgs();
    document.dispatchEvent(new CustomEvent("belm:lang", { detail: { lang: lang } }));
  }

  var money = function (n) {
    return new Intl.NumberFormat(lang, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Math.round(n));
  };

  /* ------------------------------------------------------------------ */
  /* En-tête, liens, visuels                                             */
  /* ------------------------------------------------------------------ */
  function initStatic() {
    var burger = $("#burger"), nav = $("#nav");
    if (burger && nav) {
      burger.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); }); });
    }

    var hdr = $(".site-header");
    var onScroll = function () { hdr.classList.toggle("is-stuck", window.scrollY > 24); };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

    var bg = function (sel, url) { var e = $(sel); if (e) e.style.backgroundImage = "url(" + url + "), linear-gradient(135deg, #4d6b4f, #24402f)"; };
    var href = function (sel, url) { var e = $(sel); if (e) e.href = url; };
    var text = function (sel, v) { var e = $(sel); if (e) e.textContent = v; };
    bg("#heroBg", C.hero.home); bg("#imgFresse", C.hero.fresse); bg("#imgBresse", C.hero.bresse); bg("#posterBg", C.hero.fresse);

    href("#rvFresseAir", C.reviews.fresse.airbnb); href("#rvFresseGoo", C.reviews.fresse.google);
    href("#rvBresseAir", C.reviews.bresse.airbnb); href("#rvBresseGoo", C.reviews.bresse.google);

    var mail = $("#mailLink"); if (mail) { mail.href = "mailto:" + C.contact.email; mail.textContent = C.contact.email; }
    if (C.contact.phone && $("#phoneLine")) {
      $("#phoneLine").hidden = false;
      var p = $("#phoneLink"); p.href = "tel:" + C.contact.phone.replace(/\s+/g, ""); p.textContent = C.contact.phone;
    }
    href("#fbLink", C.contact.facebook); href("#ytLink", C.contact.youtubeChannel); href("#ytChannel", C.contact.youtubeChannel);
    text("#addrBresse", C.contact.addresses.bresse); text("#addrFresse", C.contact.addresses.fresse);
    var map = function (a) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(a); };
    href("#mapBresse", map(C.contact.addresses.bresse)); href("#mapFresse", map(C.contact.addresses.fresse));
    href("#lgMentions", C.legal.mentions); href("#lgPrivacy", C.legal.privacy); href("#lgWithdraw", C.legal.withdrawal);
    text("#year", new Date().getFullYear());

    $("#langSelect").addEventListener("change", function (e) { setLang(e.target.value, true); });
  }

  /* ------------------------------------------------------------------ */
  /* Tarifs (tableau généré depuis config.js)                            */
  /* ------------------------------------------------------------------ */
  function renderRates() {
    var P = C.pricing, tb = $("#rateTable tbody"); if (!tb) return;
    var row = function (label, u) {
      return "<tr><th scope='row'>" + label + "</th>" + ["low", "mid", "high"].map(function (s) {
        return "<td><b>" + u[s][0] + "</b> <i>/</i> " + u[s][1] + " €</td>";
      }).join("") + "</tr>";
    };
    tb.innerHTML =
      row(t("u.m1") + " · " + t("u.m2"), P.units.m1) + row(t("u.m3"), P.units.m3) + row(t("u.m4"), P.units.m4);
    var tw = $("#rateTable").parentNode, note = $("#cleanNote");
    if (!note) { note = document.createElement("p"); note.id = "cleanNote"; note.className = "small"; tw.parentNode.insertBefore(note, tw.nextSibling); }
    note.textContent = t("rates.cleaning") + " : " + t("u.m1") + "/" + t("u.m2") + " " + P.units.m1.cleaning + " € · " + t("u.m3") + " " + P.units.m3.cleaning + " € · " +
      t("u.m4") + " " + P.units.m4.cleaning + " € · " + t("rates.entire") + " " + P.chalet.cleaning + " €";
  }

  /* ------------------------------------------------------------------ */
  /* Galeries photos + lightbox                                          */
  /* ------------------------------------------------------------------ */
  var gal = { site: "fresse", cat: "all", items: [] };
  var CATS = ["all", "exterieur", "piscine", "interieur", "chambres", "detente", "hiver"];

  function altOf(p) { return D.fr[p.alt] ? t(p.alt) : (p.alt || ""); }

  function setGallerySite(site) {
    gal.site = site; gal.cat = "all";
    $$("#galTabs .tab").forEach(function (b) {
      var on = b.getAttribute("data-site") === site; b.classList.toggle("is-on", on); b.setAttribute("aria-selected", on ? "true" : "false");
    });
    renderGalleryChips(); renderGallery();
  }

  function renderGalleryChips() {
    var list = C.photos[gal.site] || [], present = {};
    list.forEach(function (p) { present[p.cat] = true; });
    var box = $("#galChips"); if (!box) return; box.innerHTML = "";
    CATS.forEach(function (c) {
      if (c !== "all" && !present[c]) return;
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip" + (gal.cat === c ? " is-on" : ""); b.textContent = t("cat." + c);
      b.addEventListener("click", function () { gal.cat = c; renderGalleryChips(); renderGallery(); });
      box.appendChild(b);
    });
  }

  function renderGallery() {
    var box = $("#gallery"); if (!box) return; box.innerHTML = "";
    var list = (C.photos[gal.site] || []).filter(function (p) { return gal.cat === "all" || p.cat === gal.cat; });
    gal.items = [];
    list.forEach(function (p, i) {
      var item = { p: p, ok: null, el: null };
      var fig = document.createElement("button");
      fig.type = "button"; fig.className = "g-item" + (i % 7 === 0 ? " wide" : "");
      var img = new Image(); img.loading = "lazy"; img.decoding = "async"; img.alt = altOf(p); img.src = p.src;
      var cap = document.createElement("span"); cap.className = "g-cap"; cap.textContent = altOf(p);
      img.addEventListener("load", function () { item.ok = true; fig.classList.add("is-ready"); });
      img.addEventListener("error", function () {
        item.ok = false; fig.classList.add("is-missing"); fig.disabled = true;
        img.remove();
        var ph = document.createElement("span"); ph.className = "g-ph";
        ph.innerHTML = '<svg viewBox="0 0 64 40" width="54" aria-hidden="true"><path d="M2 38 20 12l10 14 8-10 24 22z" fill="currentColor" opacity=".35"/><circle cx="48" cy="9" r="5" fill="currentColor" opacity=".35"/></svg><em>' + t("gallery.placeholder") + "</em>";
        fig.insertBefore(ph, cap);
      });
      fig.appendChild(img); fig.appendChild(cap);
      fig.addEventListener("click", function () { if (item.ok) openLightbox(item); });
      item.el = fig; gal.items.push(item); box.appendChild(fig);
    });
  }

  var lb = { idx: 0, list: [] };
  function openLightbox(item) {
    lb.list = gal.items.filter(function (x) { return x.ok; });
    lb.idx = Math.max(0, lb.list.indexOf(item));
    $("#lightbox").hidden = false; document.body.classList.add("no-scroll");
    showLb(); $("#lbClose").focus();
  }
  function showLb() {
    var it = lb.list[lb.idx]; if (!it) return;
    var img = $("#lbImg"); img.src = it.p.src; img.alt = altOf(it.p);
    $("#lbCap").textContent = altOf(it.p) + "  ·  " + (lb.idx + 1) + " / " + lb.list.length;
    var multi = lb.list.length > 1; $("#lbPrev").hidden = !multi; $("#lbNext").hidden = !multi;
  }
  function stepLb(d) { if (!lb.list.length) return; lb.idx = (lb.idx + d + lb.list.length) % lb.list.length; showLb(); }
  function closeLb() { $("#lightbox").hidden = true; document.body.classList.remove("no-scroll"); $("#lbImg").src = ""; }

  function initGallery() {
    if (!$("#gallery")) return;
    $$("#galTabs .tab").forEach(function (b) { b.addEventListener("click", function () { setGallerySite(b.getAttribute("data-site")); }); });
    $("#lbClose").addEventListener("click", closeLb);
    $("#lbPrev").addEventListener("click", function () { stepLb(-1); });
    $("#lbNext").addEventListener("click", function () { stepLb(1); });
    $("#lightbox").addEventListener("click", function (e) { if (e.target === this || e.target.classList.contains("lb-fig")) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if ($("#lightbox").hidden) return;
      if (e.key === "Escape") closeLb(); else if (e.key === "ArrowLeft") stepLb(-1); else if (e.key === "ArrowRight") stepLb(1);
    });
    var sx = null, box = $("#lightbox");
    box.addEventListener("touchstart", function (e) { sx = e.changedTouches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50) stepLb(dx > 0 ? -1 : 1);
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /* Visite virtuelle : pièces cliquables synchronisées avec la vidéo    */
  /* (YouTube n'est chargé qu'après un clic, en mode sans cookie)        */
  /* ------------------------------------------------------------------ */
  var tour = { yt: null, ready: false, loading: false, pending: null, cur: -1, zone: "all", timer: null, fallback: false, started: false };
  var ZONES = ["all", "ext", "rdc", "etage", "detente"];
  function chs() { return C.videoChapters || []; }
  function mmss(s) { return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  function chapterAt(tm) { var a = chs(), r = 0; for (var i = 0; i < a.length; i++) if (a[i].t <= tm) r = i; return r; }
  function chEnd(i) { var a = chs(); return i + 1 < a.length ? a[i + 1].t : (C.videoDuration || a[i].t + 20); }

  function renderTour() {
    var zbox = $("#tourZones"), rbox = $("#tourRooms"), tl = $("#tourTimeline"); if (!zbox) return;
    var a = chs(), msg = $("#playerMsg"), btn = $("#playBtn");
    if (C.youtubeVideoId) { msg.textContent = t("tour.consent"); btn.setAttribute("aria-label", t("tour.play")); btn.hidden = false; }
    else { msg.textContent = t("tour.soon"); btn.hidden = true; }

    var present = {}; a.forEach(function (c) { present[c.zone] = true; });
    zbox.innerHTML = "";
    ZONES.forEach(function (z) {
      if (z !== "all" && !present[z]) return;
      var b = document.createElement("button"); b.type = "button"; b.className = "chip" + (tour.zone === z ? " is-on" : ""); b.textContent = t("tour.zone." + z);
      b.addEventListener("click", function () { tour.zone = z; renderTour(); });
      zbox.appendChild(b);
    });

    rbox.innerHTML = "";
    a.forEach(function (c, i) {
      if (tour.zone !== "all" && c.zone !== tour.zone) return;
      var b = document.createElement("button"); b.type = "button"; b.className = "room"; b.setAttribute("data-i", i);
      var img = document.createElement("span"); img.className = "room-img"; img.style.backgroundImage = "url(" + c.img + ")";
      var num = document.createElement("span"); num.className = "room-num"; num.textContent = i + 1;
      var tm = document.createElement("span"); tm.className = "room-time"; tm.textContent = mmss(c.t);
      img.appendChild(num); img.appendChild(tm);
      var txt = document.createElement("span"); txt.className = "room-txt";
      var nm = document.createElement("b"); nm.textContent = t("ch." + c.id);
      var ds = document.createElement("span"); ds.textContent = t("chd." + c.id);
      txt.appendChild(nm); txt.appendChild(ds); b.appendChild(img); b.appendChild(txt);
      b.addEventListener("click", function () { playAt(c.t); if (window.matchMedia("(max-width: 980px)").matches) $("#player").scrollIntoView({ behavior: "smooth", block: "center" }); });
      rbox.appendChild(b);
    });

    tl.innerHTML = "";
    a.forEach(function (c, i) {
      var sg = document.createElement("button"); sg.type = "button"; sg.className = "seg-t"; sg.style.flexGrow = String(Math.max(1, chEnd(i) - c.t));
      sg.title = t("ch." + c.id) + " · " + mmss(c.t); sg.setAttribute("aria-label", sg.title); sg.setAttribute("data-i", i);
      sg.addEventListener("click", function () { playAt(c.t); });
      tl.appendChild(sg);
    });
    setActive(tour.cur, false);
  }

  function setActive(i, autoScroll) {
    var a = chs(); tour.cur = i;
    $$("#tourRooms .room").forEach(function (el) { el.classList.toggle("is-active", +el.getAttribute("data-i") === i); });
    $$("#tourTimeline .seg-t").forEach(function (el) { var k = +el.getAttribute("data-i"); el.classList.toggle("is-active", k === i); el.classList.toggle("is-past", i >= 0 && k < i); });
    var nm = $("#nowName"), ds = $("#nowDesc");
    if (i >= 0 && a[i]) { nm.textContent = t("ch." + a[i].id); ds.textContent = t("chd." + a[i].id); } else { nm.textContent = ""; ds.textContent = ""; }
    $("#tourPrev").disabled = i <= 0; $("#tourNext").disabled = i >= a.length - 1;
    if (autoScroll && i >= 0) {
      var card = $('#tourRooms .room[data-i="' + i + '"]'), box = $("#tourRooms");
      if (card && box) box.scrollTo({ top: card.offsetTop - 4, left: card.offsetLeft - 4, behavior: "smooth" });
    }
  }

  function loadYTApi(ok, fail) {
    if (window.YT && window.YT.Player) { ok(); return; }
    var done = false, once = function (fn) { return function () { if (!done) { done = true; fn(); } }; };
    var good = once(ok), bad = once(fail), prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () { if (typeof prev === "function") prev(); good(); };
    var sc = document.createElement("script"); sc.src = "https://www.youtube.com/iframe_api"; sc.async = true; sc.onerror = bad;
    document.head.appendChild(sc); setTimeout(bad, 8000);
  }

  function iframeFallback(start) {
    var box = $("#player"), f = $("iframe", box);
    if (!f) {
      var host = $("#ytHost"); f = document.createElement("iframe");
      f.title = t("tour.title"); f.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      f.allowFullscreen = true; f.referrerPolicy = "strict-origin-when-cross-origin";
      if (host) host.replaceWith(f); else box.appendChild(f);
    }
    f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(C.youtubeVideoId) + "?autoplay=1&rel=0&modestbranding=1&playsinline=1&start=" + (start || 0);
  }

  function createPlayer() {
    tour.yt = new window.YT.Player("ytHost", {
      host: "https://www.youtube-nocookie.com", videoId: C.youtubeVideoId, width: "100%", height: "100%",
      playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1, start: tour.pending || 0 },
      events: {
        onReady: function () {
          tour.ready = true;
          if (tour.pending !== null) { tour.yt.seekTo(tour.pending, true); tour.pending = null; }
          tour.yt.playVideo();
          if (!tour.timer) tour.timer = setInterval(function () {
            if (!tour.ready || !tour.yt || !tour.yt.getCurrentTime) return;
            var i = chapterAt(tour.yt.getCurrentTime()); if (i !== tour.cur) setActive(i, true);
          }, 400);
        },
        onError: function () { tour.fallback = true; tour.ready = false; iframeFallback(tour.pending || 0); }
      }
    });
  }

  function playAt(tm) {
    if (!C.youtubeVideoId) return;
    $("#player").classList.add("is-playing");
    setActive(chapterAt(tm), false);
    if (tour.yt && tour.ready) { tour.yt.seekTo(tm, true); tour.yt.playVideo(); return; }
    if (tour.fallback) { iframeFallback(tm); return; }
    tour.pending = tm;
    if (tour.loading) return;
    tour.loading = true;
    loadYTApi(createPlayer, function () { tour.fallback = true; iframeFallback(tour.pending || 0); });
  }

  function stepRoom(d) {
    var a = chs(); if (!a.length) return;
    var i = Math.min(a.length - 1, Math.max(0, (tour.cur < 0 ? 0 : tour.cur) + d)); playAt(a[i].t);
  }

  function initTour() {
    if (!$("#player")) return;
    if (C.videoPoster) $("#posterBg").style.backgroundImage = "url(" + C.videoPoster + ")";
    $("#playBtn").addEventListener("click", function () { playAt(0); });
    $("#posterBg").addEventListener("click", function () { playAt(0); });
    $("#tourPrev").addEventListener("click", function () { stepRoom(-1); });
    $("#tourNext").addEventListener("click", function () { stepRoom(1); });
  }

  /* ------------------------------------------------------------------ */
  /* Google Agenda (chargé uniquement après un clic)                     */
  /* ------------------------------------------------------------------ */
  var gcal = { site: "fresse", loaded: {} };
  function gcalUrl(site) {
    var raw = (C.googleCalendars || {})[site]; if (!raw) return "";
    try { var u = new URL(raw); if (u.hostname !== "calendar.google.com") return ""; u.searchParams.set("hl", lang); u.searchParams.set("ctz", "Europe/Paris"); return u.toString(); } catch (e) { return ""; }
  }
  function renderGcal() {
    var box = $("#gcal"); if (!box) return;
    var sites = ["fresse", "bresse"].filter(function (k) { return gcalUrl(k); });
    box.hidden = !sites.length; if (!sites.length) return;
    if (sites.indexOf(gcal.site) < 0) gcal.site = sites[0];
    var tabs = $("#gcalTabs"); tabs.innerHTML = "";
    sites.forEach(function (k) {
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "tab");
      b.className = "tab" + (gcal.site === k ? " is-on" : ""); b.setAttribute("aria-selected", gcal.site === k ? "true" : "false"); b.textContent = t("gcal." + k);
      b.addEventListener("click", function () { gcal.site = k; renderGcal(); });
      tabs.appendChild(b);
    });
    var frame = $("#gcalFrame"), old = $("iframe", frame); if (old) old.remove();
    var info = $("#gcalInfo"), btn = $("#gcalLoad"), consent = $(".gcal-consent", frame);
    info.textContent = t("gcal.info." + gcal.site); btn.textContent = t("gcal.load");
    var loaded = !!gcal.loaded[gcal.site];
    btn.hidden = loaded; consent.hidden = loaded;
    if (loaded) {
      var f = document.createElement("iframe"); f.className = "gcal-iframe"; f.title = t("gcal.title"); f.loading = "lazy";
      f.src = gcalUrl(gcal.site); frame.appendChild(f);
    }
  }
  function initGcal() {
    var btn = $("#gcalLoad"); if (!btn) return;
    btn.addEventListener("click", function () { gcal.loaded[gcal.site] = true; renderGcal(); });
  }

  /* ------------------------------------------------------------------ */
  /* Réservation                                                         */
  /* ------------------------------------------------------------------ */
  var UNIT_KEYS = ["m1", "m2", "m3", "m4"];
  var B = { site: "fresse", units: [], arrive: null, depart: null, view: null, avail: { fresse: [], m1: [], m2: [], m3: [], m4: [], all: [] }, err: "", errCode: "" };

  // --- utilitaires de dates (UTC pour éviter les décalages d'heure d'été)
  function iso(d) { return d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0") + "-" + String(d.getUTCDate()).padStart(2, "0"); }
  function parse(s) { var p = s.split("-"); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function addDays(s, n) { var d = parse(s); d.setUTCDate(d.getUTCDate() + n); return iso(d); }
  function diffDays(a, b) { return Math.round((parse(b) - parse(a)) / 86400000); }
  function todayISO() { var n = new Date(); return n.getFullYear() + "-" + String(n.getMonth() + 1).padStart(2, "0") + "-" + String(n.getDate()).padStart(2, "0"); }
  function fmtDate(s) { return new Intl.DateTimeFormat(lang, { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(parse(s)); }

  function easter(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25),
      g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4,
      l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
    return y + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
  }
  var holidayCache = {};
  function holidays(y) {
    if (holidayCache[y]) return holidayCache[y];
    var e = easter(y), set = {};
    ["01-01", "05-01", "05-08", "07-14", "08-15", "11-01", "11-11", "12-25"].forEach(function (md) { set[y + "-" + md] = 1; });
    [1, 39, 50].forEach(function (n) { set[addDays(e, n)] = 1; });
    return (holidayCache[y] = set);
  }
  function isHoliday(s) { return !!holidays(+s.slice(0, 4))[s]; }
  function isWeekendNight(s) { var w = parse(s).getUTCDay(); return w === 5 || w === 6; }
  function season(s) {
    var md = s.slice(5);
    for (var i = 0; i < C.seasons.length; i++) {
      var r = C.seasons[i], inside = r.from <= r.to ? (md >= r.from && md <= r.to) : (md >= r.from || md <= r.to);
      if (inside) return r.level;
    }
    return "low";
  }

  // --- disponibilités
  function activeKeys() { return B.site === "fresse" ? ["fresse"] : (B.units.length === 4 ? ["all"].concat(UNIT_KEYS) : ["all"].concat(B.units)); }
  function nightBusy(date) {
    var keys = activeKeys();
    for (var k = 0; k < keys.length; k++) {
      var arr = B.avail[keys[k]] || [];
      for (var i = 0; i < arr.length; i++) if (date >= arr[i][0] && date < arr[i][1]) return true;
    }
    return false;
  }
  function rangeFree(a, d) { for (var x = a; x < d; x = addDays(x, 1)) if (nightBusy(x)) return false; return true; }
  function loadAvailability() {
    fetch("data/availability.json", { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j) return; Object.keys(B.avail).forEach(function (k) { if (Array.isArray(j[k])) B.avail[k] = j[k]; });
      renderCalendar(); updateEstimate();
    }).catch(function () { /* hors-ligne ou fichier absent : tout est libre */ });
  }

  // --- calendrier
  function renderCalendar() {
    var cal = $("#cal"); if (!cal) return;
    if (!B.view) { var n = todayISO(); B.view = n.slice(0, 8) + "01"; }
    var today = todayISO(), html = "";
    var head = '<div class="cal-nav"><button type="button" class="cal-btn" id="calPrev" aria-label="' + t("book.prev") + '">‹</button><span></span><button type="button" class="cal-btn" id="calNext" aria-label="' + t("book.next") + '">›</button></div>';
    var months = "";
    for (var m = 0; m < 2; m++) {
      var first = parse(B.view); first.setUTCMonth(first.getUTCMonth() + m); first.setUTCDate(1);
      var title = new Intl.DateTimeFormat(lang, { month: "long", year: "numeric", timeZone: "UTC" }).format(first);
      var offset = (first.getUTCDay() + 6) % 7, dim = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
      var cells = "";
      for (var w = 0; w < 7; w++) cells += '<span class="dow">' + new Intl.DateTimeFormat(lang, { weekday: "narrow", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 1 + w))) + "</span>";
      for (var o = 0; o < offset; o++) cells += "<span></span>";
      for (var d = 1; d <= dim; d++) {
        var ds = iso(new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), d)));
        var past = ds < today, busy = nightBusy(ds), cls = "day", dis = false;
        var selecting = B.arrive && !B.depart;
        if (past) { cls += " past"; dis = true; }
        else if (selecting && ds > B.arrive) { if (rangeFree(B.arrive, ds)) { if (busy) cls += " edge"; } else { cls += " busy"; dis = true; } }
        else if (busy) { cls += " busy"; dis = true; }
        if (B.arrive && ds === B.arrive) cls += " sel start";
        if (B.arrive && B.depart && ds > B.arrive && ds < B.depart) cls += " sel mid";
        if (B.depart && ds === B.depart) cls += " sel end";
        if (isWeekendNight(ds)) cls += " we";
        cells += '<button type="button" class="' + cls + '" data-d="' + ds + '"' + (dis ? " disabled" : "") + ">" + d + "</button>";
      }
      months += '<div class="month"><p class="mtitle">' + title + '</p><div class="mgrid">' + cells + "</div></div>";
    }
    cal.innerHTML = head + '<div class="months">' + months + "</div>";
    $("#calPrev").onclick = function () { var v = parse(B.view); v.setUTCMonth(v.getUTCMonth() - 1); if (iso(v) >= todayISO().slice(0, 8) + "01") { B.view = iso(v); renderCalendar(); } };
    $("#calNext").onclick = function () { var v = parse(B.view); v.setUTCMonth(v.getUTCMonth() + 1); B.view = iso(v); renderCalendar(); };
    $$(".day", cal).forEach(function (b) { b.addEventListener("click", function () { pickDay(b.getAttribute("data-d")); }); });
    $("#outIn").textContent = B.arrive ? fmtDate(B.arrive) : "—";
    $("#outOut").textContent = B.depart ? fmtDate(B.depart) : "—";
  }

  function pickDay(ds) {
    if (!B.arrive || B.depart || ds <= B.arrive) { B.arrive = ds; B.depart = null; }
    else if (rangeFree(B.arrive, ds)) { B.depart = ds; }
    else { B.arrive = ds; B.depart = null; }
    renderCalendar(); updateEstimate();
  }

  // --- estimation
  function selectedUnits() { return B.site === "fresse" ? [] : B.units; }
  function capacity() {
    var P = C.pricing;
    if (B.site === "fresse") return P.fresse.capacity;
    if (B.units.length === 4) return P.chalet.capacity;
    return Math.min(P.chalet.capacity, B.units.reduce(function (s, u) { return s + P.units[u].capacity; }, 0));
  }
  function minNights() {
    var P = C.pricing.minNights;
    if (B.site === "bresse") return P.bresse;
    if (!B.arrive || !B.depart) return P.fresseStandard;
    for (var x = B.arrive; x < B.depart; x = addDays(x, 1)) if (isWeekendNight(x) || isHoliday(x) || season(x) === "high") return P.fresseBusy;
    return P.fresseStandard;
  }

  function compute(mode, guestsOverride, minorsOverride) { // mode : "season" | "low" | "high"
    var P = C.pricing, nights = diffDays(B.arrive, B.depart), stay = 0, entire = B.site === "bresse" && B.units.length === 4;
    for (var x = B.arrive; x < B.depart; x = addDays(x, 1)) {
      var lvl = mode === "season" ? season(x) : mode, we = isWeekendNight(x) || isHoliday(x), nightly = 0;
      if (B.site === "fresse") nightly = P.fresse[lvl];
      else if (entire) nightly = P.chalet[lvl];
      else B.units.forEach(function (u) { nightly += P.units[u][lvl][we ? 1 : 0]; });
      stay += nightly;
    }
    var combo = 0;
    if (B.site === "bresse" && !entire && B.units.length > 1) { combo = stay * P.combinationDiscount; stay -= combo; }
    var disc = 0; if (nights >= 14) disc = stay * P.twoWeeksDiscount; else if (nights >= 7) disc = stay * P.weekDiscount;
    var cleaning = B.site === "fresse" ? P.fresse.cleaning : entire ? P.chalet.cleaning : Math.min(P.chalet.cleaning, B.units.reduce(function (s, u) { return s + P.units[u].cleaning; }, 0));
    var guests = Math.max(1, guestsOverride || parseInt(($("#guests") || {}).value, 10) || 1), linen = guests * P.linenPerPerson;
    var minors = minorsOverride != null ? minorsOverride : (parseInt(($("#minors") || {}).value, 10) || 0), adults = Math.max(0, guests - Math.max(0, minors));
    var tax = (P.touristTaxPerPersonNight || 0) * adults * nights;
    return { nights: nights, stay: stay + combo, combo: combo, disc: disc, cleaning: cleaning, linen: linen, tax: tax, total: stay - disc + cleaning + linen + tax };
  }

  function validateSelection() {
    B.err = ""; B.errCode = "";
    var g = parseInt(($("#guests") || {}).value, 10) || 0;
    if (B.site === "bresse" && !B.units.length) { B.errCode = "units"; B.err = t("book.err.units"); return false; }
    if (B.arrive && B.depart) {
      var n = diffDays(B.arrive, B.depart), mn = minNights();
      if (n < mn) { B.errCode = "min"; B.err = t("book.err.min", { n: mn }); return false; }
      if (!rangeFree(B.arrive, B.depart)) { B.errCode = "busy"; B.err = t("book.err.busy"); return false; }
    }
    if (B.site === "fresse" || B.units.length) { var cap = capacity(); if (g > cap) { B.errCode = "cap"; B.err = t("book.err.cap", { n: cap }); return false; } }
    return true;
  }

  function airbnbHref() {
    var A = C.airbnb; if (B.site === "fresse") return A.fresse;
    if (B.units.length === 1) return A[B.units[0]];
    if (B.units.length === 2 && B.units.indexOf("m3") > -1 && B.units.indexOf("m4") > -1) return A.m34;
    return A.chalet;
  }

  function updateEstimate() {
    var box = $("#estBody"); if (!box) return;
    $("#airbnbLink").href = airbnbHref();
    $("#sendBtn").disabled = false;
    var ok = validateSelection(), e = $("#formErr");
    e.hidden = !B.err; e.textContent = B.err;
    if (!B.arrive || !B.depart) { box.innerHTML = '<p class="muted">' + t("book.est.empty") + "</p>"; return; }
    if (B.site === "bresse" && !B.units.length) { box.innerHTML = ""; return; }
    var r = compute("season"), nl = r.nights + " " + (r.nights > 1 ? t("book.nights") : t("book.night"));
    var rows = '<p class="est-dates">' + fmtDate(B.arrive) + " → " + fmtDate(B.depart) + " · <b>" + nl + "</b></p><dl class='est'>";
    rows += "<dt>" + t("book.est.stay") + "</dt><dd>" + money(r.stay) + "</dd>";
    if (r.combo) rows += "<dt>" + t("book.est.combo") + "</dt><dd>− " + money(r.combo) + "</dd>";
    if (r.disc) rows += "<dt>" + t("book.est.disc") + "</dt><dd>− " + money(r.disc) + "</dd>";
    rows += "<dt>" + t("book.est.cleaning") + "</dt><dd>" + money(r.cleaning) + "</dd>";
    rows += "<dt>" + t("book.est.linen") + "</dt><dd>" + money(r.linen) + "</dd>";
    if (r.tax) rows += "<dt>" + t("book.est.tax") + "</dt><dd>" + money(r.tax) + "</dd>";
    rows += "</dl>";
    if (!C.pricing.touristTaxPerPersonNight) rows += '<p class="small">' + t("rates.tax") + "</p>";
    var banded = B.site === "fresse" || B.units.length === 4;
    if (banded) { var lo = compute("low"), hi = compute("high"); rows += '<p class="est-total"><span>' + t("book.est.total") + "</span><b>" + money(r.total) + "</b></p><p class='small'>" + t("book.est.range") + " " + money(lo.total) + " – " + money(hi.total) + "</p>"; }
    else rows += '<p class="est-total"><span>' + t("book.est.total") + "</span><b>" + money(r.total) + "</b></p>";
    rows += '<p class="small">' + t("book.est.note") + "</p>";
    box.innerHTML = rows;
    $("#sendBtn").disabled = !ok;
  }

  function onSiteChange() {
    B.site = $('input[name="site"]:checked').value;
    $("#unitsBox").hidden = B.site !== "bresse";
    if (B.site === "bresse" && !B.units.length) { B.units = ["m3"]; syncUnitBoxes(); }
    B.arrive = null; B.depart = null; renderCalendar(); updateEstimate();
  }
  function syncUnitBoxes() { $$('input[name="unit"]').forEach(function (c) { c.checked = B.units.indexOf(c.value) > -1; }); }
  function onUnitsChange() {
    B.units = $$('input[name="unit"]:checked').map(function (c) { return c.value; });
    if (B.arrive && B.depart && !rangeFree(B.arrive, B.depart)) { B.arrive = null; B.depart = null; }
    renderCalendar(); updateEstimate();
  }

  // --- envoi
  var formState = "";
  function updateFormMsgs() { /* messages d'état retraduits */
    var ok = $("#formOk"); if (!ok || !formState) return;
    ok.textContent = formState === "ok" ? t("book.ok") : formState === "mail" ? t("book.mail") : t("book.fail", { mail: C.contact.email });
  }
  function payloadText(p) {
    var L = [
      "Demande de réservation — site Gîtes BEL'M", "",
      "Lieu : " + (p.site === "fresse" ? "Fresse-sur-Moselle (BEL'M Amiral)" : "La Bresse — " + (p.units.length === 4 ? "chalet entier" : p.units.join(", ").toUpperCase())),
      "Arrivée : " + p.arrive, "Départ : " + p.depart, "Nuits : " + p.nights, "Voyageurs : " + p.guests + (p.minors ? " (dont " + p.minors + " mineur(s))" : ""),
      "Options : " + (p.options.length ? p.options.join(", ") : "aucune"),
      "Estimation : " + Math.round(p.estimate) + " €", "",
      "Nom : " + p.name, "E-mail : " + p.email, "Téléphone : " + (p.phone || "—"), "Langue du visiteur : " + p.lang, "", "Message : " + (p.message || "—")
    ];
    return L.join("\n");
  }

  function submitForm(ev) {
    ev.preventDefault();
    var f = ev.target, e = $("#formErr"), ok = $("#formOk"); ok.hidden = true; formState = "";
    var fail = function (m) { e.hidden = false; e.textContent = m; };
    if (f.elements._gotcha.value) { formState = "ok"; ok.hidden = false; updateFormMsgs(); return; }
    if (B.site === "bresse" && !B.units.length) return fail(t("book.err.units"));
    if (!B.arrive || !B.depart) return fail(t("book.err.dates"));
    if (!validateSelection()) return fail(B.err);
    var name = f.elements.name.value.trim(), email = f.elements.email.value.trim();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(t("book.err.fields"));
    var est = compute("season");
    var p = {
      site: B.site, units: B.site === "bresse" ? B.units.slice() : [], arrive: B.arrive, depart: B.depart, nights: est.nights,
      guests: parseInt(f.elements.guests.value, 10) || 1, minors: parseInt(f.elements.minors.value, 10) || 0, options: $$('input[name="opt"]:checked').map(function (c) { return c.value; }),
      estimate: est.total, name: name, email: email, phone: f.elements.phone.value.trim(), message: f.elements.message.value.trim(), lang: lang
    };
    e.hidden = true;
    var done = function (state) { formState = state; ok.hidden = false; updateFormMsgs(); };
    if (C.formEndpoint) {
      $("#sendBtn").disabled = true;
      fetch(C.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: p.name, email: p.email, _replyto: p.email, _subject: "Demande de réservation BEL'M — " + p.arrive + " → " + p.depart, message: payloadText(p) }) })
        .then(function (r) { if (!r.ok) throw new Error("http " + r.status); done("ok"); f.reset(); B.arrive = B.depart = null; syncUnitBoxes(); renderCalendar(); updateEstimate(); })
        .catch(function () { done("fail"); })
        .then(function () { $("#sendBtn").disabled = false; });
    } else {
      var href = "mailto:" + C.contact.email + "?subject=" + encodeURIComponent("Demande de réservation BEL'M — " + p.arrive + " → " + p.depart) + "&body=" + encodeURIComponent(payloadText(p));
      done("mail"); window.location.href = href;
    }
  }

  function initBooking() {
    if (!$("#bookForm")) return;
    $$('input[name="site"]').forEach(function (r) { r.addEventListener("change", onSiteChange); });
    $$('input[name="unit"]').forEach(function (c) { c.addEventListener("change", onUnitsChange); });
    $("#allUnits").addEventListener("click", function () { B.units = UNIT_KEYS.slice(); syncUnitBoxes(); onUnitsChange(); });
    $("#clearDates").addEventListener("click", function () { B.arrive = B.depart = null; renderCalendar(); updateEstimate(); });
    $("#guests").addEventListener("input", updateEstimate); $("#minors").addEventListener("input", updateEstimate);
    $("#bookForm").addEventListener("submit", submitForm);
  }

  // --- API pour l'assistant : devis et disponibilités sans toucher au formulaire
  function withState(req, fn) {
    var save = { site: B.site, units: B.units, arrive: B.arrive, depart: B.depart };
    B.site = req.site; B.units = req.site === "bresse" ? req.units : []; B.arrive = req.arrive; B.depart = req.depart;
    try { return fn(); } finally { B.site = save.site; B.units = save.units; B.arrive = save.arrive; B.depart = save.depart; }
  }
  function quote(req) { // req : {site, units, arrive, depart, guests}
    return withState(req, function () {
      var nights = diffDays(req.arrive, req.depart), res = { nights: nights, today: todayISO() };
      res.free = rangeFree(req.arrive, req.depart);
      res.minNights = minNights(); res.tooShort = nights < res.minNights;
      res.capacity = capacity(); res.overCap = !!req.guests && req.guests > res.capacity;
      res.past = req.arrive < res.today;
      res.banded = req.site === "fresse" || req.units.length === 4;
      res.r = compute("season", req.guests || 1, req.minors || 0);
      res.lo = res.banded ? compute("low", req.guests || 1, req.minors || 0) : null; res.hi = res.banded ? compute("high", req.guests || 1, req.minors || 0) : null;
      res.alts = [];
      if (!res.free) {
        for (var k = 1; k <= 28 && res.alts.length < 2; k++) [k, -k].forEach(function (sh) {
          if (res.alts.length >= 2) return;
          var a = addDays(req.arrive, sh), d = addDays(req.depart, sh);
          if (a >= res.today && rangeFree(a, d) && !res.alts.some(function (x) { return x[0] === a; })) res.alts.push([a, d]);
        });
      }
      return res;
    });
  }
  function busyIn(req, monthStart, monthEnd) { // périodes prises recoupant [monthStart, monthEnd)
    return withState(Object.assign({ arrive: null, depart: null }, req), function () {
      var out = [], cur = null;
      for (var x = monthStart; x < monthEnd; x = addDays(x, 1)) {
        if (nightBusy(x)) { if (!cur) cur = [x, addDays(x, 1)]; else cur[1] = addDays(x, 1); }
        else if (cur) { out.push(cur); cur = null; }
      }
      if (cur) out.push(cur);
      return out;
    });
  }

  /* ------------------------------------------------------------------ */
  window.BelmApp = {
    t: function (k, v) { return t(k, v); }, lang: function () { return lang; },
    quote: quote, busyIn: busyIn, money: function (n) { return money(n); }, fmtDate: fmtDate, today: todayISO, addDays: addDays, iso: iso, parse: parse
  };

  document.addEventListener("DOMContentLoaded", function () {
    initStatic(); initGallery(); initTour(); initGcal(); initBooking(); loadAvailability();
    lang = detectLang();
    var qs = new URLSearchParams(location.search), wanted = qs.get("site");
    var site = (wanted === "bresse" || wanted === "fresse") ? wanted : "fresse";
    if ($("#bookForm")) { var r = $('input[name="site"][value="' + site + '"]'); if (r) r.checked = true; }
    setLang(lang, false);
    if ($("#gallery")) setGallerySite(site);
    if ($("#bookForm")) {
      onSiteChange();
      // Pré-remplissage depuis l'assistant : ?site=&units=m3,m4&from=AAAA-MM-JJ&to=AAAA-MM-JJ&guests=N
      var re = /^\d{4}-\d{2}-\d{2}$/, u = (qs.get("units") || "").split(",").filter(function (x) { return UNIT_KEYS.indexOf(x) > -1; });
      if (site === "bresse" && u.length) { B.units = u; syncUnitBoxes(); }
      var g = parseInt(qs.get("guests"), 10); if (g > 0) $("#guests").value = g;
      var mi = parseInt(qs.get("minors"), 10); if (mi > 0) $("#minors").value = mi;
      if (re.test(qs.get("from") || "") && re.test(qs.get("to") || "") && qs.get("to") > qs.get("from")) { B.arrive = qs.get("from"); B.depart = qs.get("to"); B.view = B.arrive.slice(0, 8) + "01"; }
      renderCalendar(); updateEstimate();
    }
  });
})();
