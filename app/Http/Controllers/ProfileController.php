<?php

namespace App\Http\Controllers;

use App\Services\GithubCalendar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Affiche la page de profil.
     */
    public function show(Request $request, GithubCalendar $github): Response
    {
        $profile = config('profile');

        return Inertia::render('Profile', [
            'profile' => $profile,
            // Servi depuis le cache, que la commande profile:github tient à jour.
            // Si GitHub est injoignable, la valeur est null et la carte se réduit
            // à un simple lien : pas de données de repli inventées.
            'github' => $github->forLogin(
                $profile['github']['login'],
                $profile['github']['cache_hours'],
            ),
        ]);
    }
}
