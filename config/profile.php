<?php

/*
|--------------------------------------------------------------------------
| Contenu du profil
|--------------------------------------------------------------------------
|
| La source de vérité est resources/data/profile.json, lu ici par Laravel et
| importé tel quel par le build statique. Un seul fichier à modifier pour
| changer le contenu, quel que soit le mode de rendu.
|
*/

return json_decode(file_get_contents(__DIR__.'/../resources/data/profile.json'), true);
