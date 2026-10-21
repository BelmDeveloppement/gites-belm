# Gîtes BEL'M — nouveau site

Site statique (HTML / CSS / JavaScript, **sans outil de build, sans cookie, sans police externe**) pour les deux chalets :
**BEL'M Amiral** (Fresse-sur-Moselle) et **Gîtes BEL'M** (La Bresse, 4 logements).

## Ce qui est inclus

| Demande | Réalisation |
|---|---|
| Système de réservation | Calendrier de disponibilités, choix du chalet / des logements, estimation du prix en direct (saisons, week-ends/fériés, remises, ménage, draps), contrôle des durées minimales et de la capacité, envoi de la demande par e-mail |
| Galeries plus attrayantes | Grille en mosaïque, filtres par thème (extérieur, piscine, intérieur…), agrandissement plein écran (clavier, glissement tactile), chargement différé |
| Chatbot | Assistant FAQ dans le coin de l'écran (tarifs, capacité, horaires, piscine/sauna, ski, activités…), + lien vers l'assistant Botpress existant pour les questions plus fines |
| Visite virtuelle de Fresse | Visite interactive tirée de votre vidéo : 17 pièces cliquables avec vignettes, lecteur vertical, frise de progression et pièce « en cours » synchronisée avec la lecture, filtres par zone (extérieur, rez-de-chaussée, étage, espace détente). YouTube n'est chargé (sans cookie) qu'au clic |
| Choix de la langue | Français, English, Deutsch, Nederlands — détection automatique du navigateur, mémorisée |

## À faire pour finaliser (≈ 15 min)

Tout se règle dans **`assets/js/config.js`** :

1. **Contact** : remplacez `jean-marc.misert@laposte.net` par votre vraie adresse (et ajoutez le téléphone si souhaité).
2. **Visite virtuelle** : l'identifiant YouTube est renseigné (`youtubeVideoId`). Les 17 pièces sont dans `videoChapters` :
   si un passage est mal placé, corrigez sa seconde de début (`t`). Les noms et descriptions sont dans `i18n.js` (clés `ch.<id>` / `chd.<id>`).
   Les vignettes sont dans `photos/fresse/visite/`.
3. **Photos** : déposez vos fichiers dans `photos/fresse/` et `photos/bresse/` en respectant les noms de la liste
   `photos` du fichier de config (ou modifiez la liste). Tant qu'une photo est absente, un visuel « bientôt disponible » s'affiche.
   Conseil : JPEG de 1600 px de large maximum, moins de 300 Ko chacun.
4. **Réception des demandes** : créez un formulaire gratuit sur [formspree.io](https://formspree.io), puis collez son adresse dans `formEndpoint`.
   Sans cela, la demande s'ouvre dans la messagerie du visiteur (ça fonctionne, mais c'est moins fluide).
5. **Saisons** : ajustez les dates de `seasons` (basse / moyenne / haute) selon votre calendrier réel. Pour Fresse et le chalet entier,
   les tarifs « de… à… » de l'ancien site sont modélisés par saison (480 / 600 / 800 € et 350 / 420 / 500 €) : modifiez-les à votre convenance.
6. **Pages légales** : les liens pointent encore vers l'ancien site Jimdo. Gardez-le actif ou recréez ces pages avant de le supprimer.

## Calendriers et disponibilités

Trois niveaux, au choix :

1. **Afficher vos Google Agenda comme sur l'ancien site** — dans `assets/js/config.js`, remplissez `googleCalendars`
   (`fresse` et `bresse`) avec l'adresse d'intégration (Google Agenda → Paramètres de l'agenda → « Intégrer l'agenda » →
   l'adresse `https://calendar.google.com/calendar/embed?src=…`). L'agenda doit être public. Il ne se charge qu'après un clic.
2. **Alimenter automatiquement le calendrier de réservation** — une GitHub Action (`.github/workflows/sync-availability.yml`)
   lit vos agendas au format iCal toutes les 3 heures et met à jour `data/availability.json`.
   Ajoutez les adresses iCal comme *secrets* du dépôt (Settings → Secrets and variables → Actions) :
   `ICAL_FRESSE`, `ICAL_BRESSE_ALL`, `ICAL_M1`, `ICAL_M2`, `ICAL_M3`, `ICAL_M4` (seules celles que vous renseignez sont utilisées).
   - Google Agenda : « Adresse secrète au format iCal » dans les paramètres de l'agenda.
   - Airbnb : *Calendrier → Disponibilité → Synchroniser les calendriers → Exporter le calendrier* (un lien par annonce).
   - Dans `scripts/sources.json`, `busy` = les évènements sont des **réservations** ; `free` = les évènements sont les **jours disponibles**
     (c'était peut-être le cas de vos agendas Jimdo).
   - Pour lancer tout de suite : onglet **Actions → Synchroniser les disponibilités → Run workflow**.
3. **À la main** — éditez `data/availability.json` : une ligne par période `["2026-12-20", "2026-12-27"]`
   (nuits du 20 au 26 incluses). Clés : `fresse`, `m1`, `m2`, `m3`, `m4`, `all` (bloque tout La Bresse).

## Mise en ligne avec GitHub Pages

```bash
cd gites-belm
git init && git add . && git commit -m "Nouveau site Gîtes BEL'M"
git branch -M main
git remote add origin https://github.com/BelmDeveloppement/gites-belm.git   # dépôt à créer sur GitHub
git push -u origin main
```

Puis sur GitHub : **Settings → Pages → Deploy from a branch → `main` / root**.
Pour garder un nom de domaine propre, ajoutez-le dans Pages (champ « Custom domain »).

## Tester en local

```bash
python3 -m http.server 8000   # puis ouvrir http://localhost:8000
```

## Structure

```
index.html                 page unique (sections ancrées)
assets/css/style.css       design
assets/js/config.js        ★ réglages (contact, vidéo, tarifs, saisons, photos)
assets/js/i18n.js          textes FR / EN / DE / NL
assets/js/main.js          langue, galeries, visite, réservation
assets/js/chatbot.js       assistant FAQ
data/availability.json     périodes indisponibles (mis à jour automatiquement si les agendas sont reliés)
scripts/                   synchronisation iCal → disponibilités
.github/workflows/         tâche planifiée de synchronisation
photos/                    vos images
```

## Limites à connaître

- Le prix affiché est une **estimation** : la confirmation (disponibilité, tarif, options) reste manuelle par e-mail.
- Pas de paiement en ligne ni de synchronisation automatique avec Airbnb dans cette version (voir « Mettre à jour les disponibilités »).
- Les textes en anglais, allemand et néerlandais sont des traductions soignées mais à relire par un locuteur natif si possible.
