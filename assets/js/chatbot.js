/* Assistant de chat BEL'M — FAQ multilingue sans serveur ni cookie.
   Les réponses sont dans i18n.js (clés "chat.a.*"). Les mots-clés ci-dessous couvrent FR / EN / DE / NL. */
(function () {
  "use strict";
  var C = window.BELM, A = window.BelmApp;
  var $ = function (s) { return document.querySelector(s); };

  var INTENTS = [
    { id: "kitchen", kw: ["raclette", "fondue", "air fryer", "airfryer", "friteuse", "mixeur", "robot", "monsieur cuisine", "mister cuisine", "cafetiere", "bouilloire", "grille-pain", "materiel de cuisine", "ustensiles", "coffee machine", "coffee maker", "kettle", "toaster", "kitchenware", "kitchen equipment", "blender", "food processor", "kaffeemaschine", "wasserkocher", "kuchenausstattung", "kuchenmaschine", "koffiezetapparaat", "waterkoker", "broodrooster", "keukenmachine", "keukenapparatuur"] },
    { id: "transport", kw: ["train", "gare", "bus", "navette", "taxi", "transports", "transport en commun", "sans voiture", "public transport", "without a car", "bahn", "bahnhof", "zug", "ohne auto", "trein", "treinstation", "zonder auto", "openbaar vervoer", "comment venir", "comment arriver", "comment se rendre", "need a car", "need car", "voiture necessaire", "faut-il une voiture", "besoin d'une voiture", "en voiture", "by car", "how to get", "get there", "wie komme", "hoe kom", "autoreis", "mit dem auto", "met de auto"] },
    { id: "kids",    kw: ["securite", "dangereux", "danger", "enfants en bas age", "jeunes enfants", "petits enfants", "adapte aux enfants", "child safe", "safe for kids", "safe for children", "kid friendly", "child friendly", "family friendly", "sicherheit", "kindersicher", "kinderfreundlich", "gefahr", "veiligheid", "kindvriendelijk", "gevaarlijk", "securise", "securisee", "sur pour", "sicher fur", "veilig voor", "safe for"] },
    { id: "beds",    kw: ["chambre", "chambres", "lit", "lits", "lit double", "lits doubles", "literie", "mezzanine", "couchage", "couchages", "bedroom", "bedrooms", "beds", "bed", "double bed", "sleeping", "schlafzimmer", "betten", "bett", "doppelbett", "slaapkamer", "slaapkamers", "bedden", "bed", "tweepersoonsbed"] },
    { id: "outdoor", kw: ["terrasse", "balcon", "jardin", "exterieur", "exterieurs", "four a bois", "four a pizza", "salon de jardin", "chaise longue", "chaises longues", "parasol", "transat", "terrace", "balcony", "garden", "outdoor", "outdoors", "patio", "bbq", "barbecue", "plancha", "garten", "balkon", "tuin", "terras", "liegestuhl", "sonnenschirm", "houtoven"] },
    { id: "tv",      kw: ["tv", "television", "tele", "netflix", "molotov", "chaine tv", "chaines tv", "chaines", "streaming", "fernseher", "fernsehen", "tv-sender", "televisie", "zenders"] },
    { id: "laundry", kw: ["lave-linge", "lave linge", "laverie", "machine a laver", "seche-linge", "seche linge", "washing machine", "laundry", "dryer", "washer", "waschmaschine", "trockner", "wasmachine", "droger", "wasserette"] },
    { id: "games",   kw: ["billard", "babyfoot", "escape game", "escape", "flechette", "flechettes", "jeux", "jeu de societe", "salle de sport", "fitness", "gym", "darts", "pool table", "board games", "games", "table football", "kicker", "tischkicker", "billiard", "dart", "gesellschaftsspiele", "spiele", "fitnessraum", "biljart", "tafelvoetbal", "spelletjes", "gezelschapsspellen", "fitnessruimte"] },
    { id: "parking", kw: ["parking", "se garer", "garer", "stationnement", "park", "parkplatz", "parkeren", "parkeerplaats"] },
    { id: "farm",     kw: ["ferme-auberge", "fermes-auberges", "ferme auberge", "fermes auberges", "auberge", "auberges", "restaurant", "restaurants", "ou manger", "repas marcaire", "marcaire", "where to eat", "eat out", "eating out", "farm inn", "farm inns", "farm-inn", "essen gehen", "bauernwirtschaft", "gasthof", "restaurants in der", "uit eten", "waar eten", "boerderijherberg", "eetcafe"] },
    { id: "cleaning", kw: ["consigne", "consignes", "departure instructions", "leaving instructions", "check-out instructions", "checkout instructions", "vor der abreise", "before departure", "voor vertrek", "menage", "avant de partir", "poubelle", "poubelles", "vaisselle", "cleaning", "before leaving", "rubbish", "trash", "garbage", "dishes", "reinigung", "endreinigung", "muell", "mull", "schoonmaak", "afval", "afwas"] },
    { id: "wifi",    kw: ["wifi", "wi-fi", "wlan", "internet", "teletravail", "debit", "remote work", "work from home", "home office", "homeoffice", "thuiswerken", "bandwidth"] },
    { id: "checkin", kw: ["cle", "cles", "clef", "clefs", "boite a cles", "conciergerie", "concierge", "accueil", "key", "keys", "key box", "keybox", "schlussel", "schluessel", "schlusselkasten", "sleutel", "sleutels", "sleutelkluisje", "welcome"] },
    { id: "shops",   kw: ["courses", "supermarche", "boulangerie", "commerce", "commerces", "magasin", "epicerie", "grocery", "groceries", "supermarket", "bakery", "shops", "shopping", "einkaufen", "supermarkt", "backerei", "baeckerei", "bakker", "winkel", "boodschappen"] },
    { id: "heating", kw: ["chauffage", "chauffe", "poele", "cheminee", "heating", "heater", "stove", "fireplace", "heizung", "ofen", "kamin", "verwarming", "kachel", "haard"] },
    { id: "tax",     kw: ["taxe", "taxes", "tourist tax", "city tax", "kurtaxe", "toeristenbelasting"] },
    { id: "direct",  kw: ["en direct", "book direct", "direct booking", "direct boeken", "direktbuchung", "airbnb", "commission", "service fee", "frais de service", "moins cher", "pas cher", "cheaper", "best price", "meilleur prix", "meilleur tarif", "plateforme", "platform", "plattform"] },
    { id: "meals",   kw: ["petit dejeuner", "petit-dejeuner", "breakfast", "repas", "diner", "dejeuner", "meal", "meals", "dinner", "lunch", "fruhstuck", "fruehstuck", "abendessen", "mittagessen", "ontbijt", "demi-pension", "half board", "halbpension", "halfpension"] },
    { id: "pets",    kw: ["chien", "chiens", "animal", "animaux", "chat accepte", "toutou", "dog", "dogs", "pets", "my pet", "haustier", "haustiere", "hund", "hunde", "katze", "katzen", "huisdier", "huisdieren", "hond", "honden", "katten"] },
    { id: "party",   kw: ["fete", "fetes", "anniversaire", "soiree", "mariage", "evenement", "bruit", "party", "parties", "birthday", "wedding", "noise", "feier", "feiern", "geburtstag", "hochzeit", "larm", "feest", "feesten", "verjaardag", "bruiloft", "lawaai"] },
    { id: "payment", kw: ["acompte", "paiement", "payer", "virement", "solde", "carte bancaire", "payment", "how to pay", "bezahlen", "zahlung", "anzahlung", "betalen", "betaling", "aanbetaling", "voorschot"] },
    { id: "cancel",  kw: ["annul", "annuler", "annulation", "cancellation", "cancel my", "stornierung", "annulering", "rembours", "cancel", "refund", "stornier", "storno", "erstattung", "annuleren", "restitutie", "terugbetal"] },
    { id: "caution", kw: ["caution", "depot de garantie", "security deposit", "damage deposit", "kaution", "borg", "waarborg"] },
    { id: "baby",    kw: ["bebe", "lit parapluie", "chaise haute", "cot", "crib", "high chair", "highchair", "with baby", "with a baby", "infant", "toddler", "babybett", "kinderbett", "hochstuhl", "mit baby", "babybed", "babybedje", "kinderstoel", "babystoel", "met baby", "kampeerbed"] },
    { id: "smoke",   kw: ["fumeur", "fumeurs", "fumer", "cigarette", "smoke", "smoking", "smoker", "rauchen", "raucher", "roken", "rokers"] },
    { id: "ev",      kw: ["voiture electrique", "vehicule electrique", "borne", "recharge", "electric car", "charging", "ladestation", "elektroauto", "elektrische auto", "laadpaal"] },
    { id: "pmr",     kw: ["pmr", "handicap", "mobilite reduite", "fauteuil roulant", "ascenseur", "accessib", "wheelchair", "disabled", "mobility", "elevator", "rollstuhl", "barrierefrei", "behindert", "rolstoel", "toegankelijk"] },
    { id: "late",    kw: ["arrivee tardive", "tardive", "arrive tard", "arriver tard", "arriverai tard", "arrivons tard", "arriverons tard", "tard le soir", "tard dans la soiree", "apres 20", "late arrival", "arrive late", "after 8", "late check", "spate anreise", "spat anreisen", "nach 20", "late aankomst", "laat aankomen", "na 20"] },
    { id: "winter",  kw: ["pneu", "pneus", "deneig", "verglas", "chaines a neige", "chaines neige", "winter tyres", "winter tires", "snow chains", "snow tyres", "road conditions", "winterreifen", "schneeketten", "winterbanden", "sneeuwkettingen"] },
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

  /* ---------------- Compréhension des dates, personnes et logements ---------------- */
  var MONTHS = {
    janvier: 1, fevrier: 2, mars: 3, avril: 4, mai: 5, juin: 6, juillet: 7, aout: 8, septembre: 9, octobre: 10, novembre: 11, decembre: 12,
    janv: 1, fevr: 2, avr: 4, juil: 7, sept: 9,
    january: 1, february: 2, march: 3, april: 4, june: 6, july: 7, august: 8, october: 10, december: 12,
    januar: 1, februar: 2, marz: 3, maerz: 3, juni: 6, juli: 7, oktober: 10, dezember: 12,
    januari: 1, februari: 2, maart: 3, mei: 5, augustus: 8,
    jan: 1, feb: 2, fev: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, okt: 10, nov: 11, dec: 12, dez: 12
  };
  var MKEYS = Object.keys(MONTHS).sort(function (a, b) { return b.length - a.length; });
  var M = MKEYS.join("|");
  var MFULL = MKEYS.filter(function (k) { return k.length >= 4 || k === "mai" || k === "mei"; }).join("|");
  var ORD = "(?:er|st|nd|rd|th|\\.)?";
  var RANGE_RE = new RegExp("(\\d{1,2})" + ORD + "\\s*(?:au|a|to|bis|tot|et|-|–|→|until|till|jusqu'au)\\s*(\\d{1,2})" + ORD + "\\s*(?:de\\s+|of\\s+)?(" + M + ")\\b\\.?(?:\\s*(\\d{4}))?");
  var TOK_RE = new RegExp("(\\d{4})-(\\d{2})-(\\d{2})|(\\d{1,2})" + ORD + "\\s*(?:de\\s+|of\\s+)?(" + M + ")\\b\\.?(?:\\s*(\\d{4}))?|(" + M + ")\\b\\.?\\s*(\\d{1,2})(?:st|nd|rd|th)?\\b(?:,?\\s*(\\d{4}))?|(\\d{1,2})[\\/.](\\d{1,2})(?:[\\/.](\\d{2,4}))?", "g");
  var MONTH_ONLY_RE = new RegExp("\\b(" + MFULL + ")\\b\\.?(?:\\s*(\\d{4}))?");
  var AVAIL_RE = /\b(libres?|dispo\w*|available|availability|free|vacant|verfugbar|frei|beschikbaar|vrij|open)\b/;

  function mk(y, m, d) { var dt = new Date(Date.UTC(y, m - 1, d)); return (dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d) ? A.iso(dt) : null; }
  function resolve(d, m, y, after) {
    var today = A.today(), c;
    if (y) return mk(y < 100 ? 2000 + y : y, m, d);
    var base = +(after || today).slice(0, 4); c = mk(base, m, d); if (!c) return null;
    if (after) { if (c <= after) c = mk(base + 1, m, d); } else if (c < today) c = mk(base + 1, m, d);
    return c;
  }
  function nextFriday() { var d = A.parse(A.today()), add = ((5 - d.getUTCDay()) + 7) % 7 || 7; return A.addDays(A.today(), add); }

  function parseSlots(raw) {
    var q = norm(raw), out = { arrive: null, depart: null, nights: null, guests: null, minors: null, site: null, units: null, entire: false, month: null }, m, x;
    // week-end
    var we = /\b(week-?end|wochenende)\b/.test(q); if (we) q = q.replace(/\b(week-?end|wochenende)\b/g, " ");
    // dates
    if ((m = RANGE_RE.exec(q))) {
      var mo = MONTHS[m[3]], a = resolve(+m[1], mo, m[4] ? +m[4] : null, null);
      if (a) { var d2 = resolve(+m[2], mo, m[4] ? +m[4] : null, a); if (d2 && d2 <= a) { var nm = mo % 12 + 1; d2 = mk(+a.slice(0, 4) + (mo === 12 ? 1 : 0), nm, +m[2]); } out.arrive = a; out.depart = d2; }
      q = q.replace(RANGE_RE, " ");
    } else {
      var found = [];
      TOK_RE.lastIndex = 0;
      while ((x = TOK_RE.exec(q))) {
        if (x[1]) found.push({ y: +x[1], m: +x[2], d: +x[3] });
        else if (x[4]) found.push({ d: +x[4], m: MONTHS[x[5]], y: x[6] ? +x[6] : null });
        else if (x[7]) found.push({ d: +x[8], m: MONTHS[x[7]], y: x[9] ? +x[9] : null });
        else if (x[10] && +x[11] >= 1 && +x[11] <= 12) found.push({ d: +x[10], m: +x[11], y: x[12] ? +x[12] : null });
      }
      if (found.length) {
        out.arrive = resolve(found[0].d, found[0].m, found[0].y, null);
        if (found.length > 1 && out.arrive) { out.depart = resolve(found[1].d, found[1].m, found[1].y, out.arrive); if (out.depart && out.depart <= out.arrive) out.depart = null; }
      }
    }
    if (!out.arrive) {
      if (/\b(noel|christmas|weihnacht\w*|kerst\w*)\b/.test(q)) { var y1 = +A.today().slice(0, 4), c = mk(y1, 12, 24); if (c < A.today()) c = mk(y1 + 1, 12, 24); out.arrive = c; out.depart = A.addDays(c, 3); }
      else if (/(nouvel an|new year|silvester|nieuwjaar|reveillon)/.test(q)) { var y2 = +A.today().slice(0, 4), c2 = mk(y2, 12, 30); if (c2 < A.today()) c2 = mk(y2 + 1, 12, 30); out.arrive = c2; out.depart = A.addDays(c2, 3); }
      else if (we) { out.arrive = nextFriday(); out.depart = A.addDays(out.arrive, 2); }
      else if ((m = MONTH_ONLY_RE.exec(q))) { var mm = MONTHS[m[1]], yy = m[2] ? +m[2] : +A.today().slice(0, 4); if (!m[2] && mk(yy, mm, 28) < A.today()) yy++; out.month = { y: yy, m: mm }; }
    }
    // nuits / semaines
    if ((m = /(\d{1,2})\s*(?:nuits?|nights?|nachte|nacht|naechte|nachten)\b/.exec(q))) out.nights = +m[1];
    else if ((m = /\b(\d{1,2}|une?|one|eine?|een|deux|two|zwei|twee)\s+(?:semaines?|weeks?|wochen?)\b/.exec(q))) out.nights = 7 * ({ un: 1, une: 1, one: 1, ein: 1, eine: 1, een: 1, deux: 2, two: 2, zwei: 2, twee: 2 }[m[1]] || +m[1]);
    else if (/\b(semaine|week|woche)\b/.test(q)) out.nights = 7;
    if (out.arrive && !out.depart && out.nights) out.depart = A.addDays(out.arrive, out.nights);
    // personnes
    var g = 0, mn = 0, gm, re1 = /(\d{1,2})\s*(?:personnes?|pers\b|people|persons?|guests?|adults?|adultes?|personen|gaste|gaeste|leute|pax|mensen|volwassenen|erwachsene)/g;
    while ((gm = re1.exec(q))) g += +gm[1];
    var re2 = /(\d{1,2})\s*(?:enfants?|kids?|children|child|kinder|kinderen|ados?|mineurs?|minors?|bebes?)/g;
    while ((gm = re2.exec(q))) mn += +gm[1];
    if (mn && !/\b(dont|including|inclus|davon|darunter|waarvan|of which|of whom)\b/.test(q)) g += mn;
    out.minors = mn || null;
    if (!g && (gm = /(?:famille|groupe|group|gruppe|groep|family|familie)\s+(?:de\s+|of\s+|von\s+|van\s+)?(\d{1,2})\b/.exec(q))) g = +gm[1];
    if (!g && (gm = new RegExp("\\b(?:pour|for|fur|fuer|voor|avec|with|mit|met|nous sommes|we are|wir sind|we zijn|on est)\\s+(\\d{1,2})\\b(?!\\s*(?:nuit|night|nacht|nachten|jour|day|tag|dag|semaine|week|woche|[\\/.]\\d|h\\b|" + M + "))").exec(q))) g = +gm[1];
    if (g > 0 && g <= 40) out.guests = g;
    // logement
    var us = {}, um;
    var ure = /bel'?\s*m\s*([1-4])((?:\s*(?:,|et|and|und|en|\+|&|\/)\s*[1-4]\b)*)/g;
    while ((um = ure.exec(q))) { us[um[1]] = 1; (um[2].match(/[1-4]/g) || []).forEach(function (d) { us[d] = 1; }); }
    var uk = Object.keys(us).sort().map(function (d) { return "m" + d; });
    var iF = q.search(/fresse|amiral|frenat/), iB = q.search(/bresse|brabant/);
    out.entire = /(chalet (entier|complet)|(entire|whole|complete|full) chalet|ganze[sn]? chalet|hele? chalet|les 4 (logements|gites)|all 4|alle 4|tous les (logements|gites))/.test(q);
    if (uk.length) { out.site = "bresse"; out.units = uk; }
    else if (out.entire && !(iF > -1 && iB < 0)) { out.site = "bresse"; out.units = ["m1", "m2", "m3", "m4"]; }
    else if (iF > -1 && iB > -1) out.site = iF > iB ? "fresse" : "bresse";
    else if (iF > -1) out.site = "fresse";
    else if (iB > -1) out.site = "bresse";
    out.any = !!(out.arrive || out.nights || out.guests || out.site || out.month);
    return out;
  }

  /* ---------------- Contexte de conversation et réponses calculées ---------------- */
  var ctx = { site: null, units: [], arrive: null, depart: null, guests: null, minors: 0, month: null, pending: false };

  function where(c) {
    if (c.site === "fresse") return A.t("chat.s.wFresse");
    if (c.units.length === 4) return A.t("chat.s.wAll");
    return A.t("chat.s.wUnits", { list: c.units.map(function (u) { return u.slice(1); }).join(" + ") });
  }
  function chips(list) { return actions(list.map(function (o) { return { label: o.label, on: o.on }; })); }
  function userSays(label) { bubble(label, "user"); }

  function askSite() {
    ctx.pending = true;
    function pick(site, units, label) { return { label: label, on: function () { userSays(label); ctx.site = site; ctx.units = units; run(); } }; }
    var opts = [pick("fresse", [], A.t("chat.s.optFresse")), pick("bresse", ["m1", "m2", "m3", "m4"], A.t("chat.s.optAll"))];
    ["m1", "m2", "m3", "m4"].forEach(function (u) { opts.push(pick("bresse", [u], A.t("chat.s.optM", { n: u.slice(1) }))); });
    bubble(A.t("chat.s.askSite"), "bot", chips(opts));
  }
  function askNights() {
    ctx.pending = true;
    var opts = [2, 3, 5, 7].map(function (n) { var l = A.t("chat.s.nightsChip", { n: n }); return { label: l, on: function () { userSays(l); ctx.depart = A.addDays(ctx.arrive, n); run(); } }; });
    bubble(A.t("chat.s.askNights", { from: A.fmtDate(ctx.arrive) }), "bot", chips(opts));
  }

  function monthAnswer() {
    var mo = ctx.month, pad = function (n) { return String(n).padStart(2, "0"); };
    var start = mo.y + "-" + pad(mo.m) + "-01", end = (mo.m === 12 ? (mo.y + 1) + "-01" : mo.y + "-" + pad(mo.m + 1)) + "-01";
    if (start < A.today()) start = A.today();
    var name = new Intl.DateTimeFormat(A.lang(), { month: "long", year: "numeric", timeZone: "UTC" }).format(A.parse(mo.y + "-" + pad(mo.m) + "-01"));
    var busy = start < end ? A.busyIn({ site: ctx.site, units: ctx.units }, start, end) : [];
    var lines = [A.t("chat.s.monthHead", { where: where(ctx), month: name })];
    if (!busy.length) lines.push(A.t("chat.s.monthFree"));
    else busy.forEach(function (b) { lines.push("• " + A.t("chat.s.monthBusy", { from: A.fmtDate(b[0]), to: A.fmtDate(b[1]) })); });
    ctx.pending = false; ctx.month = null;
    bubble(lines.join("\n"), "bot", actions([{ label: A.t("chat.bookBtn"), href: "reservation.html?site=" + ctx.site + (ctx.site === "bresse" ? "&units=" + ctx.units.join(",") : ""), close: true }]));
  }

  function quoteAnswer() {
    var req = { site: ctx.site, units: ctx.units, arrive: ctx.arrive, depart: ctx.depart, guests: ctx.guests, minors: ctx.minors };
    var r = A.quote(req), W = where(ctx), lines = [], acts = [];
    if (r.past) { ctx.arrive = ctx.depart = null; ctx.pending = true; bubble(A.t("chat.s.past"), "bot"); return; }
    var span = { from: A.fmtDate(ctx.arrive), to: A.fmtDate(ctx.depart), n: r.nights, where: W };
    if (r.free) lines.push(A.t("chat.s.free", span));
    else {
      lines.push(A.t("chat.s.busy", span));
      lines.push(r.alts.length ? A.t("chat.s.alt") : A.t("chat.s.noalt"));
      r.alts.forEach(function (a) {
        var l = A.t("chat.s.pickAlt", { from: A.fmtDate(a[0]), to: A.fmtDate(a[1]) });
        acts.push({ label: l, on: function () { userSays(l); ctx.arrive = a[0]; ctx.depart = a[1]; run(); } });
      });
    }
    if (r.tooShort) lines.push(A.t("chat.s.min", { n: r.minNights }));
    if (r.overCap) lines.push(A.t("chat.s.cap", { n: r.capacity, where: W }));
    if (r.free) {
      var P = C.pricing, g = ctx.guests, c = r.r, adjOf = function (x) { return g ? 0 : P.linenPerPerson + x.tax; }, adj = adjOf(c);
      lines.push("");
      lines.push(A.t("book.est.stay") + " : " + A.money(c.stay));
      if (c.combo) lines.push(A.t("book.est.combo") + " : − " + A.money(c.combo));
      if (c.disc) lines.push(A.t("book.est.disc") + " : − " + A.money(c.disc));
      lines.push(A.t("book.est.cleaning") + " : " + A.money(c.cleaning));
      lines.push(g ? A.t("book.est.linen") + " (" + g + ") : " + A.money(c.linen) : A.t("chat.s.linenOnly"));
      if (c.tax && g) lines.push(A.t("book.est.tax") + " : " + A.money(c.tax));
      lines.push("➡️ " + A.t("book.est.total") + " : " + A.money(c.total - adj));
      if (r.banded) lines.push(A.t("book.est.range") + " " + A.money(r.lo.total - adjOf(r.lo)) + " – " + A.money(r.hi.total - adjOf(r.hi)));
      if (!g || !C.pricing.touristTaxPerPersonNight) lines.push(A.t("rates.tax"));
      lines.push(A.t("chat.s.note"));
      var url = "reservation.html?site=" + ctx.site + (ctx.site === "bresse" ? "&units=" + ctx.units.join(",") : "") + "&from=" + ctx.arrive + "&to=" + ctx.depart + (g ? "&guests=" + g : "") + (g && ctx.minors ? "&minors=" + ctx.minors : "");
      acts.push({ label: A.t("chat.s.cta"), href: url, close: true });
    }
    ctx.pending = false;
    bubble(lines.join("\n"), "bot", acts.length ? actions(acts) : null);
  }

  function run() {
    if (!ctx.site || (ctx.site === "bresse" && !ctx.units.length)) return askSite();
    if (!ctx.arrive && ctx.month) return monthAnswer();
    if (!ctx.arrive) { ctx.pending = true; return bubble(A.t("chat.s.askDates"), "bot"); }
    if (!ctx.depart) return askNights();
    quoteAnswer();
  }

  // Fusionne les infos du message dans le contexte ; renvoie true si l'assistant calcule une réponse.
  function tryCompute(text, id) {
    var s = parseSlots(text);
    if (!s.any) return false;
    var hadDates = !!(ctx.arrive && ctx.depart), hasDate = !!s.arrive;
    var info = id && ["rates", "book", "min", "cap"].indexOf(id) < 0;
    var q = norm(text);
    var trigger = hasDate ||
      (ctx.pending && !info) ||
      (hadDates && (s.guests || s.nights || s.site || s.units) && !info) ||
      (s.month && (AVAIL_RE.test(q) || id === "book" || id === "rates")) ||
      ((id === "rates" || id === "book") && (s.guests || s.nights)) ||
      ((s.site || s.units) && AVAIL_RE.test(q) && !info);
    if (!trigger) return false;
    if (s.site) { if (s.site !== ctx.site || s.units) ctx.units = s.units || (s.site === "bresse" && s.site === ctx.site ? ctx.units : []); ctx.site = s.site; if (s.site === "fresse") ctx.units = []; }
    if (s.guests) { ctx.guests = s.guests; ctx.minors = s.minors || 0; }
    if (hasDate) { ctx.arrive = s.arrive; ctx.depart = s.depart; ctx.month = null; }
    else if (s.nights && ctx.arrive) ctx.depart = A.addDays(ctx.arrive, s.nights);
    if (s.month && !hasDate) { ctx.month = s.month; ctx.arrive = ctx.depart = null; }
    run(); return true;
  }


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

  // Réponses propres à un site : clés chat.a.<id>.f (Fresse) et chat.a.<id>.b (La Bresse)
  function variants(id) {
    var o = {}, kf = "chat.a." + id + ".f", kb = "chat.a." + id + ".b", f = A.t(kf), b = A.t(kb);
    if (f !== kf) o.f = f; if (b !== kb) o.b = b; return o;
  }

  function answer(id) {
    var contactVars = { mail: C.contact.email, phone: C.contact.phone ? " / " + C.contact.phone : "" };
    var acts = [];
    if (id === "rates") acts = [{ label: A.t("nav.rates"), href: "tarifs.html", close: true }, { label: A.t("chat.bookBtn"), href: "reservation.html", close: true }];
    else if (id === "book" || id === "min") acts = [{ label: A.t("chat.bookBtn"), href: "reservation.html", close: true }];
    else if (id === "pool" || id === "cap") acts = [{ label: A.t("nav.gallery"), href: "photos.html", close: true }];
    else if (id === "direct") acts = [{ label: A.t("chat.bookBtn"), href: "reservation.html", close: true }];
    else if (["pets", "pmr", "late", "baby", "cancel", "payment", "caution"].indexOf(id) > -1) acts = [{ label: A.t("chat.contact"), href: "mailto:" + C.contact.email }];
    else if (id === "contact") acts = [{ label: A.t("chat.contact"), href: "mailto:" + C.contact.email }];
    else if (id === "where") acts = [{ label: A.t("nav.contact"), href: "contact.html", close: true }];
    var v = variants(id), txt;
    if (v.f || v.b) {
      var one = ctx.site === "fresse" ? "f" : ctx.site === "bresse" ? "b" : null;
      if (one) { if (!v[one]) return fallback(); txt = v[one]; }
      else {
        var parts = []; if (v.f) parts.push(A.t("chat.s.hF") + " : " + v.f); if (v.b) parts.push(A.t("chat.s.hB") + " : " + v.b);
        txt = parts.join("\n\n");
      }
    } else txt = id === "contact" ? A.t("chat.a.contact", contactVars) : A.t("chat.a." + id);
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
      var id = detect(text);
      if (tryCompute(text, id)) return;
      ctx.pending = false;
      var ss = parseSlots(text);
      if (ss.site) { if (ss.site === "fresse") { ctx.site = "fresse"; ctx.units = []; } else { ctx.site = "bresse"; ctx.units = ss.units || (ctx.site === "bresse" ? ctx.units : []); } }
      if (id) answer(id); else fallback();
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
