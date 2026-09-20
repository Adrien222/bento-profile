# bento-profile

Page de profil d'Adrien Chretien : hero typographique, grille bento et carte
de contributions GitHub. Servie par Laravel, rendue par React via Inertia.

## Stack

- Laravel 13 · PHP 8.3
- Inertia 3 + React 19
- Tailwind CSS v4 · Vite 8
- Aucune base de données : tout le contenu vit dans la configuration

## Démarrer

```bash
composer install
pnpm install
cp .env.example .env && php artisan key:generate   # si .env est absent

# deux terminaux
php artisan serve
pnpm dev
```

## Modifier le contenu

Tout se pilote depuis [`config/profile.php`](config/profile.php) : identité,
hero, bio, agence, leviers SEO, cibles Core Web Vitals, projets et réseaux.

## Carte de contributions

Les données viennent de `github.com/users/<login>/contributions`, un endpoint
public qui ne demande aucun jeton. Deux chemins de lecture, dans cet ordre :

1. **L'instantané du build** — [`scripts/fetch-github.mjs`](scripts/fetch-github.mjs)
   écrit `resources/data/github-calendar.json` pendant le build. C'est le chemin
   utilisé en production : lecture seule, aucune latence, aucun appel réseau au
   moment du rendu.
2. **La lecture en direct**, mise en cache — si l'instantané est absent. La
   commande `php artisan profile:github` rafraîchit ce cache, et la
   planification horaire de [`routes/console.php`](routes/console.php) s'en
   charge sur un hébergement classique.

Si GitHub ne répond pas, la carte se réduit à un lien vers le profil. Aucune
donnée de repli n'est inventée.

## Déploiement sur Vercel

Vercel n'exécute pas PHP nativement : Laravel y tourne via le runtime
communautaire `vercel-php`, en serverless. Les adaptations sont dans
[`vercel.json`](vercel.json) et [`api/index.php`](api/index.php) :

- le système de fichiers est en lecture seule sauf `/tmp`, d'où
  `VIEW_COMPILED_PATH=/tmp/views` et les répertoires créés au démarrage ;
- les journaux partent sur `stderr`, les sessions dans un cookie ;
- `CACHE_STORE=array` : le cache ne survit pas d'une invocation à l'autre,
  c'est précisément pourquoi le calendrier est figé au build.

### Variables d'environnement à définir dans Vercel

| Clé | Valeur |
| --- | --- |
| `APP_KEY` | la sortie de `php artisan key:generate --show` |
| `APP_URL` | l'URL du déploiement |

Les autres (`APP_ENV`, `APP_DEBUG`, `LOG_CHANNEL`, `CACHE_STORE`,
`SESSION_DRIVER`, `VIEW_COMPILED_PATH`) sont déjà posées dans `vercel.json`.

### Fraîcheur des données

Le calendrier date du dernier build. Pour le rafraîchir sans pousser de code,
crée un Deploy Hook dans Vercel et appelle-le depuis un Cron Job. Sur le plan
Hobby, les crons sont limités à un par jour.

## Repères

| Chemin | Rôle |
| --- | --- |
| `config/profile.php` | Les données affichées |
| `app/Services/GithubCalendar.php` | Lecture et cache du calendrier |
| `resources/js/Pages/Profile.jsx` | La composition de la page |
| `resources/js/Components/` | Hero, cartes, carte GitHub, révélations |
| `resources/css/app.css` | Tokens de charte et classes composant |
| `resources/views/app.blade.php` | Balises SEO servies côté serveur |

## Pistes

- Activer le rendu côté serveur d'Inertia (`php artisan inertia:start-ssr`)
  pour que le contenu soit dans le HTML et non seulement dans le JSON
- Self-héberger une vraie grotesque via le plugin `fonts` de `vite.config.js`
