/* Assistant de chat BEL'M — FAQ multilingue sans serveur ni cookie.
   Les réponses sont dans i18n.js (clés "chat.a.*"). Les mots-clés ci-dessous couvrent FR / EN / DE / NL. */
(function () {
  "use strict";
  var C = window.BELM, A = window.BelmApp;
  var $ = function (s) { return document.querySelector(s); };

  var INTENTS = [
    { id: "contact", kw: ["contact", "mail", "e-mail", "email", "telephone", "tel", "phone", "appeler", "call", "anrufen", "bellen", "joindre", "kontakt"] },
    { id: "rent",    kw: ["vtt", "luge", "raquette", "charbon", "bois", "bike", "bikes", "sledge", "sled", "snowshoe", "snowshoes", "schlitten", "schneeschuh", "slee", "sleeen", "sneeuwschoen", "holzkohle", "houtskool", "fahrrad", "fiets", "option", "options", "optionen", "opties", "verleih", "huur"] },
    { id: "linen",   kw: ["drap", "draps", "serviette", "serviettes", "linen", "towel", "towels", "bettwasche", "handtuch", "handtucher", "beddengoed", "handdoek", "handdoeken"] },
    { id: "pool",    kw: ["piscine", "pool", "sauna", "spa", "schwimmbad", "hallenbad", "zwembad", "nager", "swim", "baignade", "billard", "billiard", "biljart"] },
    { id: "times",   kw: ["arrivee", "depart", "arrival", "departure", "check", "checkin", "check-in", "checkout", "check-out", "heure", "horaire", "anreise", "abreise", "aankomst", "vertrek", "uhr", "time", "times", "tijd", "zeit", "tard", "tot", "early", "late"] },
    { id: "min",     kw: ["minimum", "minimal", "mindest", "mindestaufenthalt", "minimaal", "nuit minimum", "min stay"] },
    { id: "rates",   kw: ["prix", "tarif", "tarifs", "cout", "coute", "combien", "euro", "price", "prices", "rate", "rates", "cost", "how much", "preis", "preise", "kosten", "wieviel", "prijs", "prijzen", "tarieven", "tarief", "hoeveel", "budget"] },
    { id: "cap",     kw: ["personne", "personnes", "capacite", "couchage", "couchages", "chambre", "chambres", "lit", "lits", "guests", "people", "capacity", "sleeps", "bedroom", "bedrooms", "beds", "personen", "kapazitat", "schlafzimmer", "betten", "slaapkamer", "slaapkamers", "capaciteit", "groupe", "group", "gruppe", "groep", "famille", "family"] },
    { id: "book",    kw: ["reserv", "reserver", "reservation", "book", "booking", "disponib", "availab", "available", "buchen", "buchung", "verfugbar", "boek", "boeken", "boeking", "beschikbaar", "calendrier", "calendar", "kalender", "kalender"] },
    { id: "ski",     kw: ["ski", "piste", "pistes", "neige", "snow", "schnee", "sneeuw", "fond", "langlauf", "langlaufen", "skiing", "skien", "hiver", "winter"] },
    { id: "activities", kw: ["activite", "activites", "randonn", "rando", "hike", "hiking", "wandern", "wandelen", "wandel", "lac", "lake", "see", "meer", "gerardmer", "parapente", "paragliding", "gleitschirm", "faire", "visiter", "visit", "things to do", "todo", "activit", "aktivit", "ballon"] },
    { id: "where",   kw: ["adresse", "address", "ou", "situe", "situation", "location", "find", "route", "access", "acces", "anfahrt", "adres", "waar", "weg", "gps", "carte", "map", "karte", "kaart", "trouver"] },
    { id: "equip",   kw: ["equip", "equipement", "equipements", "equipped", "wifi", "wi-fi", "internet", "cuisine", "kitchen", "tv", "netflix", "parking", "barbecue", "bbq", "plancha", "baby", "babyfoot", "kicker", "tischkicker", "tafelvoetbal", "lave", "dishwasher", "ausstattung", "uitrusting", "keuken", "kuche", "parkplatz", "parkeren"] }
  ];

  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  var compiled = INTENTS.map(function (it) {
    return { id: it.id, res: it.kw.map(function (k) { return { w: k.split(" ").length, re: new RegExp("(^|[^a-z0-9])" + esc(norm(k))) }; }) };
  });

  function detect(text) {
    var q = norm(text), best = null, bestScore = 0;
    compiled.forEach(function (it) {
      var s = 0; it.res.forEach(function (r) { if (r.re.test(q)) s += r.w; });
      if (s > bestScore) { best = it.id; bestScore = s; }
    });
    return best;
  }

  var logEl, quickEl, panel, fab, inputEl, started = false;

  function bubble(text, who, extra) {
    var d = document.createElement("div"); d.className = "msg " + who;
    var p = document.createElement("p"); p.textContent = text; d.appendChild(p);
    if (extra) d.appendChild(extra);
    logEl.appendChild(d); logEl.scrollTop = logEl.scrollHeight; return d;
  }

  function actions(list) {
    var box = document.createElement("div"); box.className = "msg-actions";
    list.forEach(function (a) {
      var el = document.createElement(a.href ? "a" : "button");
      el.className = "mini-btn"; el.textContent = a.label;
      if (a.href) { el.href = a.href; if (a.ext) { el.target = "_blank"; el.rel = "noopener"; } if (a.close) el.addEventListener("click", function () { toggle(false); }); }
      else el.type = "button";
      if (a.on) el.addEventListener("click", a.on);
      box.appendChild(el);
    });
    return box;
  }

  function answer(id) {
    var contactVars = { mail: C.contact.email, phone: C.contact.phone ? " / " + C.contact.phone : "" };
    var acts = [];
    if (id === "rates") acts = [{ label: A.t("nav.rates"), href: "tarifs.html", close: true }, { label: A.t("chat.bookBtn"), href: "reservation.html", close: true }];
    else if (id === "book" || id === "min") acts = [{ label: A.t("chat.bookBtn"), href: "reservation.html", close: true }];
    else if (id === "pool" || id === "cap") acts = [{ label: A.t("nav.gallery"), href: "photos.html", close: true }];
    else if (id === "contact") acts = [{ label: A.t("chat.contact"), href: "mailto:" + C.contact.email }];
    else if (id === "where") acts = [{ label: A.t("nav.contact"), href: "contact.html", close: true }];
    var txt = id === "contact" ? A.t("chat.a.contact", contactVars) : A.t("chat.a." + id);
    bubble(txt, "bot", acts.length ? actions(acts) : null);
  }

  function fallback() {
    var acts = [{ label: A.t("chat.contact"), href: "mailto:" + C.contact.email }];
    if (C.botpressUrl) acts.push({ label: A.t("chat.advanced"), href: C.botpressUrl, ext: true });
    bubble(A.t("chat.fallback"), "bot", actions(acts));
  }

  function ask(text) {
    text = text.trim(); if (!text) return;
    bubble(text, "user");
    var typing = bubble("…", "bot typing");
    setTimeout(function () {
      typing.remove();
      var id = detect(text); if (id) answer(id); else fallback();
    }, 350);
  }

  function renderQuick() {
    quickEl.innerHTML = "";
    [["rates", "chat.q.rates"], ["cap", "chat.q.cap"], ["pool", "chat.q.pool"], ["times", "chat.q.times"], ["book", "chat.q.book"]].forEach(function (q) {
      var b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = A.t(q[1]);
      b.addEventListener("click", function () { bubble(A.t(q[1]), "user"); setTimeout(function () { answer(q[0]); }, 250); });
      quickEl.appendChild(b);
    });
  }

  function toggle(open) {
    open = typeof open === "boolean" ? open : panel.hidden;
    panel.hidden = !open; fab.setAttribute("aria-expanded", open ? "true" : "false"); fab.classList.toggle("is-open", open);
    if (open) {
      if (!started) { started = true; bubble(A.t("chat.hello"), "bot"); renderQuick(); }
      setTimeout(function () { inputEl.focus(); }, 50);
    }
  }

  document.addEventListener("belm:lang", function () {
    if (!panel) return;
    // Après un changement de langue, on repart d'un fil propre dans la nouvelle langue.
    if (started) { logEl.innerHTML = ""; bubble(A.t("chat.hello"), "bot"); renderQuick(); }
  });

  document.addEventListener("DOMContentLoaded", function () {
    panel = $("#chatPanel"); fab = $("#chatFab"); logEl = $("#chatLog"); quickEl = $("#chatQuick"); inputEl = $("#chatInput");
    fab.addEventListener("click", function () { toggle(); });
    $("#chatClose").addEventListener("click", function () { toggle(false); fab.focus(); });
    $("#chatForm").addEventListener("submit", function (e) { e.preventDefault(); var v = inputEl.value; inputEl.value = ""; ask(v); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) { toggle(false); fab.focus(); } });
  });
})();
