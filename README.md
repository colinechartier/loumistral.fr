# Site Lou Mistral Studio

Site vitrine mono-page, HTML/CSS/JS pur. Aucun build, aucune dépendance (hors Google Fonts).

## Arborescence

```
site/
├── netlify.toml          configuration Netlify (dossier publié + en-têtes)
├── README.md             ce fichier
└── public/               TOUT ce qui part en ligne
    ├── index.html        la page
    ├── 404.html          page d'erreur
    ├── favicon.svg       icône d'onglet
    ├── robots.txt
    ├── sitemap.xml
    └── assets/
        ├── css/style.css styles (couleurs dans :root, en haut du fichier)
        ├── js/main.js    nav, menu mobile, apparitions, rideau, récit défilant
        └── img/          og-cover.png (aperçu de partage), apple-touch-icon.png
```

## Voir le site en local

```bash
cd ~/Desktop/"LOU MISTRAL"/site/public
python3 -m http.server 8000
```
Puis ouvrir http://localhost:8000

Le rideau d'ouverture ne joue qu'une fois par onglet. Pour le revoir : nouvel onglet privé.

## Mettre en ligne

Le site est relié à GitHub (`colinechartier/loumistral.fr`). Netlify publie
automatiquement loumistral.com à chaque envoi sur la branche `main` :

```bash
cd ~/Desktop/"LOU MISTRAL"/site
git add -A
git commit -m "Ce qui a changé"
git push
```
En ligne en moins d'une minute.

## Règles

- Aucun tiret cadratin dans les textes.
- Couleurs uniquement via les variables de `:root` dans `style.css`.
- Police unique : Syne (400, 600, 700, 800).
