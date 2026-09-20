<?php

use App\Services\GithubCalendar;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
 * Rafraîchit le calendrier de contributions.
 *
 * Le contrôleur ne lit que le cache : c'est cette commande qui parle à GitHub,
 * pour qu'aucun visiteur n'attende jamais la réponse d'un service tiers.
 */
Artisan::command('profile:github', function (GithubCalendar $github) {
    $login = config('profile.github.login');

    Cache::forget("github-calendar:{$login}");

    $calendar = $github->forLogin($login, config('profile.github.cache_hours'));

    if ($calendar === null) {
        $this->error("GitHub n'a pas répondu pour @{$login}.");

        return 1;
    }

    $this->info(sprintf(
        '@%s : %d contributions sur %d jours, du %s au %s.',
        $login,
        $calendar['total'],
        count($calendar['days']),
        $calendar['start'],
        $calendar['end'],
    ));

    return 0;
})->purpose('Rafraîchit le calendrier de contributions GitHub');

Schedule::command('profile:github')->hourly();
