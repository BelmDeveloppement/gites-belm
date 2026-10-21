# Gîtes BEL'M — nouveau site

Site statique (HTML / CSS / JavaScript, **sans outil de build, sans cookie, sans police externe**) pour les deux chalets :
**BEL'M Amiral** (Fresse-sur-Moselle) et **Gîtes BEL'M** (La Bresse, 4 logements).

## Ce qui est inclus

| Demande | Réalisation |
|---|---|
| Système de réservation | Calendrier de disponibilités, choix du chalet / des logements, estimation du prix en direct (saisons, week-ends/fériés, remises, ménage, draps), contrôle des durées minimales et de la capacité, envoi de la demande par e-mail |
| Galeries plus attrayantes | Grille en mosaïque, filtres par thème (extérieur, piscine, intérieur…), agrandissement plein écran (clavier, glissement tactile), chargement différé |
| Chatbot | Assistant FAQ dans le coin de l'écran (tarifs, capacité, horaires, piscine/sauna, ski, activités…), + lien vers l'assistant Botpress existant pour les questions plus fines |
| Visite virtuelle de Fresse | Lecteur YouTube (mode sans cookie, chargé seulement au clic) avec chapitres optionnels |
| Choix de la langue | Français, English, Deutsch, Nederlands — détection automatique du navigateur, mémorisée |

## À faire pour finaliser (≈ 15 min)

Tout se règle dans **`assets/js/config.js`** :

1. **Contact** : remplacez `contact@gites-belm.fr` par votre vraie adresse (et ajoutez le téléphone si souhaité).
2. **Visite virtuelle** : collez l'identifiant de votre vidéo YouTube dans `youtubeVideoId`
   (dans `youtube.com/watch?v=ABC123xyz00`, c'est `ABC123xyz00`). Ajoutez des chapitres dans `videoChapters` si vous voulez.
3. **Photos** : déposez vos fichiers dans `photos/fresse/` et `photos/bresse/` en respectant les noms de la liste
   `photos` du fichier de config (ou modifiez la liste). Tant qu'une photo est absente, un visuel « bientôt disponible » s'affiche.
   Conseil : JPEG de 1600 px de large maximum, moins de 300 Ko chacun.
4. **Réception des demandes** : créez un formulaire gratuit sur [formspree.io](https://formspree.io), puis collez son adresse dans `formEndpoint`.
   Sans cela, la demande s'ouvre dans la messagerie du visiteur (ça fonctionne, mais c'est moins fluide).
5. **Saisons** : ajustez les dates de `seasons` (basse / moyenne / haute) selon votre calendrier réel. Pour Fresse et le chalet entier,
   les tarifs « de… à… » de l'ancien site sont modélisés par saison (480 / 600 / 800 € et 350 / 420 / 500 €) : modifiez-les à votre convenance.
6. **Pages légales** : les liens pointent encore vers l'ancien site Jimdo. Gardez-le actif ou recréez ces pages avant de le supprimer.

## Mettre à jour les disponibilités

Éditez **`data/availability.json`** : une ligne par période `["2026-12-20", "2026-12-27"]` (nuits du 20 au 26 incluses).
Clés : `fresse`, `m1`, `m2`, `m3`, `m4`, `all` (bloque tout La Bresse). Ce fichier est conçu pour être alimenté plus tard
automatiquement (export iCal Airbnb / Google Agenda → JSON), par exemple via votre projet « Gestion des réservations ».

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
data/availability.json     périodes indisponibles
photos/                    vos images
```

## Limites à connaître

- Le prix affiché est une **estimation** : la confirmation (disponibilité, tarif, options) reste manuelle par e-mail.
- Pas de paiement en ligne ni de synchronisation automatique avec Airbnb dans cette version (voir « Mettre à jour les disponibilités »).
- Les textes en anglais, allemand et néerlandais sont des traductions soignées mais à relire par un locuteur natif si possible.
