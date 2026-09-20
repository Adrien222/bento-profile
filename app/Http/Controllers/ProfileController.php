<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Affiche la grille bento du profil.
     */
    public function show(Request $request): Response
    {
        return Inertia::render('Profile', [
            'profile' => config('profile'),
        ]);
    }
}
