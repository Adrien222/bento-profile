<?php

/*
|--------------------------------------------------------------------------
| Contenu du profil
|--------------------------------------------------------------------------
|
| Toute la page se pilote depuis ce fichier : modifie les valeurs ici et
| la grille se met à jour. Aucune base de données n'est nécessaire tant
| que le contenu reste statique.
|
*/

return [

    'name' => 'Alexis',
    'headline' => 'Full-Stack Dev',
    'location' => 'Rouen, FR',
    'avatar' => null, // ex. '/img/avatar.jpg'

    'bio' => "Avec plus de 4 ans d'expérience en développement web, je conçois "
        ."et développe des produits utiles, performants et élégants.",

    'email' => 'hello@example.com',

    // Cartes de liens sociaux. 'accent' pilote la couleur de la pastille.
    'socials' => [
        ['label' => 'GitHub',   'handle' => '@ShAd-x',   'url' => 'https://github.com/ShAd-x',   'cta' => 'Follow',    'accent' => 'neutral'],
        ['label' => 'X',        'handle' => '@ShAd_x_x', 'url' => 'https://x.com/ShAd_x_x',      'cta' => 'Follow',    'accent' => 'neutral'],
        ['label' => 'LinkedIn', 'handle' => 'Alexis',    'url' => 'https://linkedin.com',        'cta' => 'Connect',   'accent' => 'blue'],
        ['label' => 'YouTube',  'handle' => '@ShAd_x_x', 'url' => 'https://youtube.com',         'cta' => 'Subscribe', 'accent' => 'red'],
    ],

    // Cartes projet, affichées en grand format.
    'projects' => [
        [
            'tag' => 'Projet phare',
            'name' => 'Serveurly',
            'domain' => 'serveurly.com',
            'url' => 'https://serveurly.com',
            'description' => 'La plateforme pour découvrir, voter et promouvoir les meilleurs serveurs de jeux vidéo.',
            'cta' => 'Visiter serveurly.com',
        ],
        [
            'tag' => 'Portfolio',
            'name' => 'alexistc.fr',
            'domain' => 'alexistc.fr',
            'url' => 'https://alexistc.fr',
            'description' => 'Réalisations techniques, projets récents et parcours professionnel.',
            'cta' => 'Explorer le portfolio',
        ],
    ],

];
