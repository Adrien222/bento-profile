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
| Tout ce qui échoue ici part sur STDERR, donc dans les journaux Vercel. Sans
| ça, une erreur fatale au démarrage ne produit qu'une 500 muette.
|
*/

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/**
 * Écrit dans les journaux Vercel et renvoie une 500 lisible.
 */
function bootFailed(string $message): never
{
    fwrite(STDERR, "[boot] {$message}\n");

    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Le démarrage de l'application a échoué. Détail dans les journaux Vercel.\n";

    exit(1);
}

foreach (['/tmp/views', '/tmp/cache', '/tmp/sessions'] as $directory) {
    if (! is_dir($directory) && ! mkdir($directory, 0755, true) && ! is_dir($directory)) {
        bootFailed("Répertoire non créé : {$directory}");
    }
}

$autoload = __DIR__.'/../vendor/autoload.php';

if (! is_file($autoload)) {
    bootFailed(
        "vendor/autoload.php absent : le runtime n'a pas installé les dépendances Composer. "
        ."Contenu de la racine : ".implode(', ', array_slice(scandir(__DIR__.'/..') ?: [], 2, 30))
    );
}

require $autoload;

try {
    /** @var Application $app */
    $app = require_once __DIR__.'/../bootstrap/app.php';

    $app->handleRequest(Request::capture());
} catch (Throwable $e) {
    bootFailed(sprintf(
        '%s : %s dans %s:%d',
        $e::class,
        $e->getMessage(),
        $e->getFile(),
        $e->getLine(),
    ));
}
