<?php

/*
|--------------------------------------------------------------------------
| Point d'entrée Vercel
|--------------------------------------------------------------------------
|
| Le runtime PHP de Vercel appelle ce fichier pour chaque requête. Le système
| de fichiers y est en lecture seule : seul /tmp est inscriptible. On prépare
| donc les répertoires dont Laravel a besoin avant de le laisser démarrer.
|
| Les chemins correspondants se règlent par variables d'environnement, voir
| VIEW_COMPILED_PATH dans vercel.json.
|
*/

foreach (['/tmp/views', '/tmp/cache', '/tmp/sessions'] as $directory) {
    if (! is_dir($directory)) {
        mkdir($directory, 0755, true);
    }
}

require __DIR__.'/../public/index.php';
