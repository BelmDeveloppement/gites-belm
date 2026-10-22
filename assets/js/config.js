/* ==========================================================
   CONFIGURATION DU SITE — c'est le seul fichier à modifier
   pour ajuster contact, vidéo, tarifs, saisons et photos.
   ========================================================== */
window.BELM = {
  // ---- Contact ----
  contact: {
    email: "jean-marc.misert@laposte.net",
    phone: "",                            // ex : "+33 6 00 00 00 00" (laisser vide pour masquer)
    facebook: "https://www.facebook.com/107251145336952",
    youtubeChannel: "https://www.youtube.com/@GitesBelM",
    addresses: {
      bresse: "71 route du Brabant, 88250 La Bresse",
      fresse: "6 chemin du Frenat, 88160 Fresse-sur-Moselle"
    }
  },

  // ---- Envoi des demandes de réservation ----
  // Option A (recommandée) : créez un formulaire gratuit sur https://formspree.io
  // et collez ici son URL, ex : "https://formspree.io/f/xxxxxxx".
  // Option B : laissez vide → la demande s'ouvre dans le logiciel de messagerie du visiteur.
  formEndpoint: "",

  // ---- Visite virtuelle du BEL'M Amiral (YouTube) ----
  // Identifiant de la vidéo : youtube.com/watch?v=XXXXXXXXXXX → "XXXXXXXXXXX"
  youtubeVideoId: "acCizWG_uLM",
  // Durée de la vidéo en secondes (sert à dimensionner la frise de la visite)
  videoDuration: 431,
  // Image affichée avant le lancement de la vidéo
  videoPoster: "photos/fresse/visite/poster.jpg",
  // Pièces de la visite : t = seconde de début dans la vidéo, zone = ext | rdc | etage | detente,
  // img = vignette. Les noms et descriptions sont dans i18n.js (clés "ch.<id>" et "chd.<id>").
  // Pour corriger un passage de la vidéo, changez simplement la valeur de `t` (en secondes).
  videoChapters: [
    { id: "arrivee",  t: 0,   zone: "ext",     img: "photos/fresse/visite/01-arrivee.jpg" },
    { id: "entree",   t: 28,  zone: "rdc",     img: "photos/fresse/visite/02-entree.jpg" },
    { id: "salon",    t: 50,  zone: "rdc",     img: "photos/fresse/visite/03-salon.jpg" },
    { id: "cuisine",  t: 70,  zone: "rdc",     img: "photos/fresse/visite/04-cuisine.jpg" },
    { id: "terrasse", t: 94,  zone: "ext",     img: "photos/fresse/visite/05-terrasse.jpg" },
    { id: "sejour",   t: 158, zone: "rdc",     img: "photos/fresse/visite/06-sejour.jpg" },
    { id: "sdd",      t: 176, zone: "rdc",     img: "photos/fresse/visite/07-sdd.jpg" },
    { id: "bar",      t: 184, zone: "rdc",     img: "photos/fresse/visite/08-bar.jpg" },
    { id: "chambre1", t: 200, zone: "etage",   img: "photos/fresse/visite/09-chambre1.jpg" },
    { id: "biblio",   t: 238, zone: "etage",   img: "photos/fresse/visite/10-biblio.jpg" },
    { id: "chambre2", t: 248, zone: "etage",   img: "photos/fresse/visite/11-chambre2.jpg" },
    { id: "chambre3", t: 294, zone: "etage",   img: "photos/fresse/visite/12-chambre3.jpg" },
    { id: "sdb",      t: 310, zone: "etage",   img: "photos/fresse/visite/13-sdb.jpg" },
    { id: "escalier", t: 334, zone: "detente", img: "photos/fresse/visite/14-escalier.jpg" },
    { id: "sauna",    t: 362, zone: "detente", img: "photos/fresse/visite/15-sauna.jpg" },
    { id: "jeux",     t: 382, zone: "detente", img: "photos/fresse/visite/16-jeux.jpg" },
    { id: "piscine",  t: 406, zone: "detente", img: "photos/fresse/visite/17-piscine.jpg" }
  ],

  // ---- Google Agenda affichés dans la rubrique Réservation (comme sur l'ancien site) ----
  // Dans Google Agenda : Paramètres de l'agenda → « Intégrer l'agenda » → copiez l'adresse qui figure
  // dans src="…" du code d'intégration (elle commence par https://calendar.google.com/calendar/embed?src=…).
  // L'agenda doit être public. Laissez vide pour masquer. Le calendrier ne se charge qu'après un clic.
  googleCalendars: {
    fresse: "https://calendar.google.com/calendar/embed?src=lour8jvvokif4etaplgobnhmueq3u7ul%40import.calendar.google.com&ctz=Europe%2FParis",   // BEL'M Amiral — Fresse-sur-Moselle
    bresse: "https://calendar.google.com/calendar/embed?src=dpq7rpcm3bkcssrfe1dter2mef0eg57g%40import.calendar.google.com&ctz=Europe%2FParis"    // Chalet entier — La Bresse
  },

  // ---- Assistant avancé (Botpress) déjà en place sur l'ancien site ----
  botpressUrl: "https://cdn.botpress.cloud/webchat/v3.6/shareable.html?configUrl=https%3A%2F%2Ffiles.bpcontent.cloud%2F2026%2F03%2F08%2F11%2F20260308112739-RJO92E4A.json",

  // ---- Avis ----
  reviews: {
    fresse: {
      airbnb: "https://www.airbnb.fr/rooms/1423003981367999237",
      google: "https://www.google.fr/maps/place/Gite+BEL%E2%80%99M+Amiral+%E2%80%93+Grand+Chalet+avec+Piscine+Int%C3%A9rieure/@47.8831826,6.8164025,17z"
    },
    bresse: {
      airbnb: "http://airbnb.fr/h/gites-belm",
      google: "https://www.google.fr/maps/place/Gites+BEL%E2%80%99M/@47.9878974,6.8706865,17z"
    }
  },

  // ---- Fiches Airbnb par logement ----
  airbnb: {
    m1: "https://www.airbnb.com/h/belm1",
    m2: "https://www.airbnb.com/h/belm2",
    m3: "https://www.airbnb.com/h/belm3",
    m4: "https://www.airbnb.com/h/belm4",
    m34: "https://www.airbnb.com/h/belm34",
    chalet: "https://www.airbnb.com/h/gites-belm",
    fresse: "https://www.airbnb.com/h/belmamiral"
  },

  // ---- Pages légales (liens vers l'ancien site tant que les nouvelles pages ne sont pas créées) ----
  legal: {
    mentions: "https://gites-belm.jimdosite.com/mentions-legales/",
    privacy: "https://gites-belm.jimdosite.com/politique-de-confidentialite/",
    withdrawal: "https://gites-belm.jimdosite.com/retractation/"
  },

  // ---- Tarifs (€ / nuit) — repris de l'ancien site ----
  pricing: {
    // [semaine, week-end/férié] par saison : low / mid / high
    units: {
      m1: { low: [70, 100],  mid: [80, 110],  high: [100, 130], cleaning: 70,  capacity: 4 },
      m2: { low: [70, 100],  mid: [80, 110],  high: [100, 130], cleaning: 70,  capacity: 4 },
      m3: { low: [140, 160], mid: [150, 180], high: [170, 220], cleaning: 120, capacity: 6 },
      m4: { low: [110, 130], mid: [120, 150], high: [140, 180], cleaning: 85,  capacity: 7 }
    },
    // Chalet entier La Bresse : 350 à 500 €/nuit (estimation selon saison)
    chalet: { low: 350, mid: 420, high: 500, cleaning: 270, capacity: 15 },
    // BEL'M Amiral : 480 à 800 €/nuit (estimation selon saison)
    fresse: { low: 480, mid: 600, high: 800, cleaning: 270, capacity: 15 },
    combinationDiscount: 0.10,   // combinaison de gîtes : somme des tarifs − 10 %
    weekDiscount: 0.10,          // 7 nuits et plus
    twoWeeksDiscount: 0.15,      // 14 nuits et plus
    touristTaxPerPersonNight: 1.3, // € par personne MAJEURE et par nuit (mettre null pour n'afficher qu'une mention « en supplément »)
    linenPerPerson: 15,          // draps + serviettes, obligatoires
    minNights: { bresse: 2, fresseStandard: 2, fresseBusy: 3 }
  },

  // ---- Saisons (mois-jour) — À AJUSTER selon votre calendrier réel ----
  // Première règle qui correspond l'emporte ; sinon "low".
  seasons: [
    { level: "high", from: "12-20", to: "01-05" },  // Noël / Nouvel An
    { level: "high", from: "02-07", to: "03-08" },  // vacances d'hiver (ski)
    { level: "high", from: "07-05", to: "08-25" },  // été
    { level: "mid",  from: "04-01", to: "06-30" },  // printemps
    { level: "mid",  from: "09-01", to: "10-31" },  // automne
    { level: "mid",  from: "01-06", to: "02-06" }
  ],

  // ---- Photos : une entrée par image. Déposez vos fichiers dans /photos/... ----
  // cat : exterieur | piscine | interieur | chambres | detente | hiver
  // `alt` : clé de traduction (i18n.js, rubrique "ph.*") ou texte libre.
  // Tant qu'un fichier est absent, un visuel d'attente élégant s'affiche à sa place.
  photos: {
    fresse: [
      { src: "photos/fresse/exterieur-01.jpg", cat: "exterieur", alt: "ph.f.ext1" },
      { src: "photos/fresse/exterieur-02.jpg", cat: "exterieur", alt: "ph.n.back" },
      { src: "photos/fresse/exterieur-03.jpg", cat: "exterieur", alt: "ph.n.sunset" },
      { src: "photos/fresse/exterieur-04.jpg", cat: "exterieur", alt: "ph.n.lavender" },
      { src: "photos/fresse/exterieur-05.jpg", cat: "exterieur", alt: "ph.n.porch" },
      { src: "photos/fresse/exterieur-06.jpg", cat: "exterieur", alt: "ph.n.pond" },
      { src: "photos/fresse/terrasse-01.jpg", cat: "exterieur", alt: "ph.f.terrace2" },
      { src: "photos/fresse/terrasse-02.jpg", cat: "exterieur", alt: "ph.n.picnic" },
      { src: "photos/fresse/four-a-bois.jpg", cat: "exterieur", alt: "ph.n.oven" },
      { src: "photos/fresse/terrasse-piscine-01.jpg", cat: "exterieur", alt: "ph.n.poolterr" },
      { src: "photos/fresse/vue-01.jpg", cat: "exterieur", alt: "ph.f.view" },
      { src: "photos/fresse/vue-02.jpg", cat: "exterieur", alt: "ph.n.heart" },
      { src: "photos/fresse/neige-01.jpg", cat: "hiver", alt: "ph.f.snow1" },
      { src: "photos/fresse/neige-02.jpg", cat: "hiver", alt: "ph.f.snow2" },
      { src: "photos/fresse/neige-03.jpg", cat: "hiver", alt: "ph.n.snowterr" },
      { src: "photos/fresse/neige-04.jpg", cat: "hiver", alt: "ph.n.snowview" },
      { src: "photos/fresse/piscine-01.jpg", cat: "piscine", alt: "ph.f.pool1" },
      { src: "photos/fresse/piscine-02.jpg", cat: "piscine", alt: "ph.n.pool3" },
      { src: "photos/fresse/piscine-03.jpg", cat: "piscine", alt: "ph.n.pool4" },
      { src: "photos/fresse/piscine-04.jpg", cat: "piscine", alt: "ph.f.pool2" },
      { src: "photos/fresse/piscine-05.jpg", cat: "piscine", alt: "ph.n.poolout" },
      { src: "photos/fresse/sauna-01.jpg", cat: "detente", alt: "ph.f.sauna" },
      { src: "photos/fresse/billard-01.jpg", cat: "detente", alt: "ph.f.billiard" },
      { src: "photos/fresse/bibliotheque-01.jpg", cat: "interieur", alt: "ph.f.library" },
      { src: "photos/fresse/fitness-01.jpg", cat: "detente", alt: "ph.n.gym" },
      { src: "photos/fresse/salle-a-manger-01.jpg", cat: "interieur", alt: "ph.f.dining" },
      { src: "photos/fresse/salle-a-manger-02.jpg", cat: "interieur", alt: "ph.n.dining2" },
      { src: "photos/fresse/salon-01.jpg", cat: "interieur", alt: "ph.f.living" },
      { src: "photos/fresse/salon-02.jpg", cat: "interieur", alt: "ph.n.stove" },
      { src: "photos/fresse/cuisine-01.jpg", cat: "interieur", alt: "ph.f.kitchen" },
      { src: "photos/fresse/cuisine-02.jpg", cat: "interieur", alt: "ph.n.kitchen2" },
      { src: "photos/fresse/salle-de-bain-01.jpg", cat: "interieur", alt: "ph.n.bath" },
      { src: "photos/fresse/chambre-01.jpg", cat: "chambres", alt: "ph.f.bed1" },
      { src: "photos/fresse/chambre-02.jpg", cat: "chambres", alt: "ph.f.bed2" },
      { src: "photos/fresse/chambre-03.jpg", cat: "chambres", alt: "ph.n.bed3" },
      { src: "photos/fresse/chambre-04.jpg", cat: "chambres", alt: "ph.n.bed4" },
      { src: "photos/fresse/dortoir-01.jpg", cat: "chambres", alt: "ph.n.dorm" },
      { src: "photos/fresse/dortoir-02.jpg", cat: "chambres", alt: "ph.n.mezz" },
      { src: "photos/fresse/mezzanine-01.jpg", cat: "chambres", alt: "ph.n.mezz2" }
    ],
    bresse: [
      { src: "photos/bresse/exterieur-01.jpg", cat: "exterieur", alt: "ph.b.ext1" },
      { src: "photos/bresse/village-01.jpg", cat: "exterieur", alt: "ph.n.chapel" },
      { src: "photos/bresse/vue-01.jpg", cat: "exterieur", alt: "ph.n.bview" },
      { src: "photos/bresse/terrasse-01.jpg", cat: "exterieur", alt: "ph.b.terrace" },
      { src: "photos/bresse/foret-01.jpg", cat: "exterieur", alt: "ph.n.forest" },
      { src: "photos/bresse/sentier-01.jpg", cat: "exterieur", alt: "ph.n.trail" },
      { src: "photos/bresse/salon-01.jpg", cat: "interieur", alt: "ph.n.bliving" },
      { src: "photos/bresse/salon-02.jpg", cat: "interieur", alt: "ph.n.bliving2" },
      { src: "photos/bresse/salon-03.jpg", cat: "interieur", alt: "ph.n.bliving3" },
      { src: "photos/bresse/repas-01.jpg", cat: "interieur", alt: "ph.n.bdining" },
      { src: "photos/bresse/cuisine-01.jpg", cat: "interieur", alt: "ph.n.bbar" },
      { src: "photos/bresse/cuisine-02.jpg", cat: "interieur", alt: "ph.n.bkitchen" },
      { src: "photos/bresse/chambre-01.jpg", cat: "chambres", alt: "ph.n.bbed1" },
      { src: "photos/bresse/chambre-02.jpg", cat: "chambres", alt: "ph.n.bbed2" },
      { src: "photos/bresse/salle-de-bain-01.jpg", cat: "interieur", alt: "ph.n.bbath" },
      { src: "photos/bresse/sauna-int-01.jpg", cat: "detente", alt: "ph.b.saunaint" },
      { src: "photos/bresse/fitness-01.jpg", cat: "detente", alt: "ph.b.fitness" }
    ]
  },

  // Visuels d'ambiance repris de l'ancien site (remplacez-les par vos fichiers dans /photos quand vous voulez)
  hero: {
    home:   "https://storage.e.jimdo.com/cdn-cgi/image/quality=85,fit=crop,format=auto,width=1600,height=900/image/549400820/67a64fb2-6028-44b5-a8e5-839923e6333c.jpg",
    fresse: "https://storage.e.jimdo.com/cdn-cgi/image/quality=85,fit=crop,format=auto,width=1200,height=800/image/519885787/4c7bf74d-19d0-4f43-97ff-8489b9d83780.jpg",
    bresse: "https://storage.e.jimdo.com/cdn-cgi/image/quality=85,fit=crop,format=auto,width=1200,height=800/image/531444414/974c48fb-2da0-48a1-b943-852fc7dc7475.jpg"
  }
};
