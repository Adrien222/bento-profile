# bento-profile

Page de profil « bento » : une grille de cartes (bio, réseaux, projets),
servie par Laravel et rendue par React via Inertia.

## Stack

- Laravel 13 · PHP 8.3
- Inertia 3 + React 19
- Tailwind CSS v4 · Vite 8
- SQLite (aucun serveur de base à lancer)

## Démarrer

```bash
composer install
pnpm install
cp .env.example .env && php artisan key:generate   # si .env est absent
php artisan migrate

# deux terminaux
php artisan serve
pnpm dev
```

## Modifier le contenu

Tout le contenu de la page vit dans [`config/profile.php`](config/profile.php) :
nom, bio, liens sociaux et projets. Aucune base de données n'est nécessaire
tant que ce contenu reste statique.

## Repères

| Chemin | Rôle |
| --- | --- |
| `config/profile.php` | Les données affichées |
| `app/Http/Controllers/ProfileController.php` | Passe la config à Inertia |
| `resources/js/Pages/Profile.jsx` | La grille bento |
| `resources/js/Components/` | `Card`, `LinkButton` |
| `resources/views/app.blade.php` | Coquille HTML racine |

## Pistes

- Remplacer `config/profile.php` par un modèle Eloquent pour éditer depuis une interface
- Ajouter un avatar dans `public/img/` puis renseigner `avatar` dans la config
- Passer en TypeScript si le projet grossit
