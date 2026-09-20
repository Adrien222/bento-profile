# bento-profile

Page de profil d'Adrien Chretien : hero typographique, grille bento et carte
de contributions GitHub. Site statique pré-rendu en React, sans base de
données ni runtime serveur.

## Stack

- React 19 · Tailwind CSS v4 · Vite 8
- Pré-rendu au build, hydraté côté navigateur
- Laravel 13 · PHP 8.3 pour le développement local, optionnel
- Aucune base de données

## Démarrer

```bash
pnpm install
pnpm build:static      # produit dist/, le site complet
```

Pour servir le résultat en local :

```bash
cd dist && python3 -m http.server 8000
```

L'application Laravel reste utilisable pour développer avec rechargement à
chaud, sur le même contenu :

```bash
composer install
cp .env.example .env && php artisan key:generate   # si .env est absent
php artisan serve      # deux terminaux
pnpm dev
```

## Modifier le contenu

Tout se pilote depuis [`resources/data/profile.json`](resources/data/profile.json) :
identité, hero, bio, agence, leviers SEO, cibles Core Web Vitals, projets et
réseaux. C'est la source unique, lue par le build statique comme par Laravel
via [`config/profile.php`](config/profile.php).

## Carte de contributions

Les données viennent de `github.com/users/<login>/contributions`, un endpoint
public qui ne demande aucun jeton.

[`scripts/fetch-github.mjs`](scripts/fetch-github.mjs) le lit au build et écrit
`resources/data/github-calendar.json` : dates, niveaux et nombre exact par
jour. Aucun appel réseau au moment où un visiteur charge la page.

Si GitHub ne répond pas, le build continue et la carte se réduit à un lien
vers le profil. Aucune donnée de repli n'est inventée.

En développement avec Laravel, [`app/Services/GithubCalendar.php`](app/Services/GithubCalendar.php)
lit le même instantané, et retombe sinon sur une lecture en direct mise en
cache que rafraîchit `php artisan profile:github`.

## Déploiement sur Vercel

Le site déployé est entièrement statique : aucun PHP ne tourne en production.
Le HTML est pré-rendu à partir des mêmes composants React, puis hydraté côté
navigateur — animations, horloge, bascule de thème et bouton de copie
fonctionnent à l'identique.

```
pnpm build:static
  ├── scripts/fetch-github.mjs   fige le calendrier de contributions
  └── scripts/prerender.mjs
        ├── build client  → dist/assets/*.js + *.css
        ├── build SSR     → .ssr/entry-server.js
        ├── rendu HTML    → dist/index.html
        └── copie         → dist/img, favicon.svg, robots.txt
```

Deux conséquences qui comptent :

- **Le contenu est dans le HTML**, pas seulement dans un JSON. Un robot
  d'indexation lit la page entière sans exécuter de JavaScript.
- **Rien à configurer sur Vercel** hormis `outputDirectory: dist`. Pas de
  runtime PHP, pas de variables d'environnement, pas de disque en lecture
  seule à contourner.

Le calendrier date du dernier build. Pour le rafraîchir sans pousser de code,
crée un Deploy Hook dans Vercel et appelle-le depuis un Cron Job.

## Repères

| Chemin | Rôle |
| --- | --- |
| `resources/data/profile.json` | Les données affichées, source unique |
| `scripts/prerender.mjs` | Le build statique livré à Vercel |
| `scripts/fetch-github.mjs` | L'instantané des contributions |
| `resources/js/Pages/Profile.jsx` | La composition de la page |
| `resources/js/Components/` | Hero, cartes, carte GitHub, révélations |
| `resources/js/static/` | Entrées de rendu et d'hydratation |
| `resources/css/app.css` | Tokens de charte et classes composant |

## Pistes

- Self-héberger une vraie grotesque via le plugin `fonts` de `vite.config.js`,
  plus proche du rendu visé que les piles système actuelles
- Retirer Laravel si le développement local via Vite suffit : il ne sert plus
  qu'au rechargement à chaud
