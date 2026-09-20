<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Lit le calendrier de contributions publié par GitHub.
 *
 * L'endpoint /users/<login>/contributions renvoie le calendrier en HTML sans
 * authentification : pas besoin de l'API GraphQL ni d'un jeton dans le .env.
 * Le résultat est mis en cache, GitHub n'est donc pas interrogé à chaque visite.
 */
class GithubCalendar
{
    private const CALENDAR_URL = 'https://github.com/users/%s/contributions';

    private const PROFILE_URL = 'https://api.github.com/users/%s';

    /**
     * Le calendrier complet, ou null si GitHub n'a pas répondu.
     *
     * On renvoie null plutôt qu'un jeu de données de repli : une carte vide
     * est honnête, une carte inventée ne l'est pas.
     *
     * @return array{days: list<array{date: string, level: int, count: int}>, total: int, start: string, end: string, repos: int|null, followers: int|null}|null
     */
    public function forLogin(string $login, int $cacheHours = 3): ?array
    {
        return Cache::remember(
            "github-calendar:{$login}",
            now()->addHours(max(1, $cacheHours)),
            fn () => $this->fetch($login),
        );
    }

    /**
     * @return array{days: list<array{date: string, level: int, count: int}>, total: int, start: string, end: string, repos: int|null, followers: int|null}|null
     */
    private function fetch(string $login): ?array
    {
        try {
            $response = Http::timeout(8)
                ->withHeaders(['User-Agent' => 'bento-profile'])
                ->get(sprintf(self::CALENDAR_URL, $login));

            if (! $response->successful()) {
                return null;
            }

            $days = $this->parseDays($response->body());

            if ($days === []) {
                return null;
            }
        } catch (Throwable $e) {
            Log::warning('Calendrier GitHub indisponible', ['login' => $login, 'message' => $e->getMessage()]);

            return null;
        }

        $profile = $this->fetchProfile($login);

        return [
            'days' => $days,
            'total' => array_sum(array_column($days, 'count')),
            'start' => $days[0]['date'],
            'end' => $days[count($days) - 1]['date'],
            'repos' => $profile['public_repos'] ?? null,
            'followers' => $profile['followers'] ?? null,
        ];
    }

    /**
     * Extrait un jour par cellule du calendrier.
     *
     * Chaque <td> porte sa date et son niveau ; le nombre exact vit dans
     * l'infobulle associée, reliée à la cellule par son identifiant.
     *
     * @return list<array{date: string, level: int, count: int}>
     */
    private function parseDays(string $html): array
    {
        $tooltips = $this->parseTooltips($html);

        preg_match_all('/<td\b[^>]*class="ContributionCalendar-day"[^>]*>/', $html, $cells);

        $days = [];

        foreach ($cells[0] as $cell) {
            if (! preg_match('/data-date="(\d{4}-\d{2}-\d{2})"/', $cell, $date)) {
                continue;
            }

            if (! preg_match('/data-level="(\d)"/', $cell, $level)) {
                continue;
            }

            $count = 0;

            if (preg_match('/id="(contribution-day-component-[\d-]+)"/', $cell, $id)) {
                $count = $tooltips[$id[1]] ?? 0;
            }

            $days[] = [
                'date' => $date[1],
                'level' => (int) $level[1],
                'count' => $count,
            ];
        }

        usort($days, fn (array $a, array $b) => strcmp($a['date'], $b['date']));

        return $days;
    }

    /**
     * Le nombre de contributions par cellule, indexé par identifiant.
     *
     * @return array<string, int>
     */
    private function parseTooltips(string $html): array
    {
        preg_match_all(
            '/<tool-tip[^>]*for="(contribution-day-component-[\d-]+)"[^>]*>(.*?)<\/tool-tip>/s',
            $html,
            $matches,
            PREG_SET_ORDER,
        );

        $counts = [];

        foreach ($matches as $match) {
            // « 12 contributions on April 2nd. » ou « No contributions on … »
            $counts[$match[1]] = preg_match('/^\s*(\d+)/', $match[2], $n) ? (int) $n[1] : 0;
        }

        return $counts;
    }

    /**
     * @return array<string, mixed>
     */
    private function fetchProfile(string $login): array
    {
        try {
            $response = Http::timeout(6)
                ->withHeaders(['User-Agent' => 'bento-profile'])
                ->get(sprintf(self::PROFILE_URL, $login));

            return $response->successful() ? (array) $response->json() : [];
        } catch (Throwable) {
            return [];
        }
    }
}
