/**
 * Fige le calendrier de contributions dans un fichier livré avec le déploiement.
 *
 * Tourne pendant le build, en Node : PHP n'est pas garanti disponible à cette
 * étape sur Vercel. En production serverless, le système de fichiers est en
 * lecture seule et le cache ne survit pas d'une invocation à l'autre ; lire un
 * fichier figé évite d'interroger GitHub à chaque démarrage à froid.
 *
 * Échouer ici ne doit pas casser le build : sans instantané, l'application
 * retombe sur la lecture en direct.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = resolve(ROOT, 'resources/data/github-calendar.json');

const LOGIN = process.env.GITHUB_LOGIN ?? 'Adrien222';

/**
 * Extrait un jour par cellule du calendrier public.
 */
function parseDays(html) {
    const tooltips = new Map();

    for (const match of html.matchAll(
        /<tool-tip[^>]*for="(contribution-day-component-[\d-]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g,
    )) {
        const count = /^\s*(\d+)/.exec(match[2]);
        tooltips.set(match[1], count ? Number(count[1]) : 0);
    }

    const days = [];

    for (const match of html.matchAll(/<td\b[^>]*class="ContributionCalendar-day"[^>]*>/g)) {
        const tag = match[0];
        const date = /data-date="(\d{4}-\d{2}-\d{2})"/.exec(tag);
        const level = /data-level="(\d)"/.exec(tag);

        if (!date || !level) {
            continue;
        }

        const id = /id="(contribution-day-component-[\d-]+)"/.exec(tag);

        days.push({
            date: date[1],
            level: Number(level[1]),
            count: id ? (tooltips.get(id[1]) ?? 0) : 0,
        });
    }

    days.sort((a, b) => a.date.localeCompare(b.date));

    return days;
}

async function json(url) {
    const response = await fetch(url, { headers: { 'User-Agent': 'bento-profile' } });

    return response.ok ? response.json() : {};
}

try {
    const response = await fetch(`https://github.com/users/${LOGIN}/contributions`, {
        headers: { 'User-Agent': 'bento-profile' },
    });

    if (!response.ok) {
        throw new Error(`GitHub a répondu ${response.status}`);
    }

    const days = parseDays(await response.text());

    if (days.length === 0) {
        throw new Error('aucune cellule trouvée dans la réponse');
    }

    const profile = await json(`https://api.github.com/users/${LOGIN}`);

    const calendar = {
        days,
        total: days.reduce((sum, day) => sum + day.count, 0),
        start: days[0].date,
        end: days[days.length - 1].date,
        repos: profile.public_repos ?? null,
        followers: profile.followers ?? null,
        baked_at: new Date().toISOString(),
    };

    await mkdir(dirname(OUTPUT), { recursive: true });
    await writeFile(OUTPUT, `${JSON.stringify(calendar)}\n`, 'utf8');

    console.log(
        `[github] @${LOGIN} : ${calendar.total} contributions sur ${days.length} jours, ` +
            `du ${calendar.start} au ${calendar.end}.`,
    );
} catch (error) {
    // Le build continue : l'application lira GitHub en direct au premier rendu.
    console.warn(`[github] instantané non généré (${error.message}), lecture en direct au runtime.`);
}
