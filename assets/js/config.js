/* ==========================================================
   CONFIGURATION DU SITE — c'est le seul fichier à modifier
   pour ajuster contact, vidéo, tarifs, saisons et photos.
   ========================================================== */
window.BELM = {
  // ---- Contact ----
  contact: {
    email: "contact@gites-belm.fr",      // À REMPLACER par votre vraie adresse
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
  // Collez l'identifiant de la vidéo : youtube.com/watch?v=XXXXXXXXXXX → "XXXXXXXXXXX"
  youtubeVideoId: "",
  // Chapitres facultatifs (secondes) pour sauter à une pièce : { label: "piscine", t: 95 }
  // `label` est une clé de traduction (voir i18n.js, rubrique "tour.chap.*").
  videoChapters: [
    // { label: "exterieur", t: 0 },
    // { label: "piscine",   t: 60 },
    // { label: "cuisine",   t: 150 },
    // { label: "chambres",  t: 210 }
  ],

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
      { src: "photos/fresse/piscine-01.jpg",   cat: "piscine",   alt: "ph.f.pool1" },
      { src: "photos/fresse/piscine-02.jpg",   cat: "piscine",   alt: "ph.f.pool2" },
      { src: "photos/fresse/sauna-01.jpg",     cat: "detente",   alt: "ph.f.sauna" },
      { src: "photos/fresse/terrasse-01.jpg",  cat: "exterieur", alt: "ph.f.terrace" },
      { src: "photos/fresse/vue-01.jpg",       cat: "exterieur", alt: "ph.f.view" },
      { src: "photos/fresse/neige-01.jpg",     cat: "hiver",     alt: "ph.f.snow1" },
      { src: "photos/fresse/neige-02.jpg",     cat: "hiver",     alt: "ph.f.snow2" },
      { src: "photos/fresse/salle-a-manger-01.jpg", cat: "interieur", alt: "ph.f.dining" },
      { src: "photos/fresse/cuisine-01.jpg",   cat: "interieur", alt: "ph.f.kitchen" },
      { src: "photos/fresse/salon-01.jpg",     cat: "interieur", alt: "ph.f.living" },
      { src: "photos/fresse/chambre-01.jpg",   cat: "chambres",  alt: "ph.f.bed1" },
      { src: "photos/fresse/chambre-02.jpg",   cat: "chambres",  alt: "ph.f.bed2" },
      { src: "photos/fresse/bibliotheque-01.jpg", cat: "interieur", alt: "ph.f.library" },
      { src: "photos/fresse/billard-01.jpg",   cat: "detente",   alt: "ph.f.billiard" }
    ],
    bresse: [
      { src: "photos/bresse/exterieur-01.jpg", cat: "exterieur", alt: "ph.b.ext1" },
      { src: "photos/bresse/m1-01.jpg",        cat: "interieur", alt: "ph.b.m1" },
      { src: "photos/bresse/m2-01.jpg",        cat: "interieur", alt: "ph.b.m2" },
      { src: "photos/bresse/m3-01.jpg",        cat: "interieur", alt: "ph.b.m3" },
      { src: "photos/bresse/m3-02.jpg",        cat: "chambres",  alt: "ph.b.m3" },
      { src: "photos/bresse/m4-01.jpg",        cat: "interieur", alt: "ph.b.m4" },
      { src: "photos/bresse/m4-02.jpg",        cat: "chambres",  alt: "ph.b.m4" },
      { src: "photos/bresse/sauna-ext-01.jpg", cat: "detente",   alt: "ph.b.saunaext" },
      { src: "photos/bresse/sauna-int-01.jpg", cat: "detente",   alt: "ph.b.saunaint" },
      { src: "photos/bresse/fitness-01.jpg",   cat: "detente",   alt: "ph.b.fitness" },
      { src: "photos/bresse/terrasse-01.jpg",  cat: "exterieur", alt: "ph.b.terrace" },
      { src: "photos/bresse/lac-des-corbeaux-01.jpg", cat: "exterieur", alt: "ph.b.lake" }
    ]
  },

  // Visuels d'ambiance repris de l'ancien site (remplacez-les par vos fichiers dans /photos quand vous voulez)
  hero: {
    home:   "https://storage.e.jimdo.com/cdn-cgi/image/quality=85,fit=crop,format=auto,width=1600,height=900/image/549400820/67a64fb2-6028-44b5-a8e5-839923e6333c.jpg",
    fresse: "https://storage.e.jimdo.com/cdn-cgi/image/quality=85,fit=crop,format=auto,width=1200,height=800/image/519885787/4c7bf74d-19d0-4f43-97ff-8489b9d83780.jpg",
    bresse: "https://storage.e.jimdo.com/cdn-cgi/image/quality=85,fit=crop,format=auto,width=1200,height=800/image/531444414/974c48fb-2da0-48a1-b943-852fc7dc7475.jpg"
  }
};
