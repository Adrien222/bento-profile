/**
 * Écrit le site statique dans dist/.
 *
 * Enchaîne : nettoyage, build client, build SSR, rendu du HTML, copie des
 * fichiers publics. Aucun PHP n'intervient, ni au build ni à l'exécution :
 * Vercel n'a plus qu'à servir des fichiers.
 */

import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(ROOT, 'dist');
const SSR = resolve(ROOT, '.ssr');

const run = (args) => execFileSync('npx', ['vite', ...args], { cwd: ROOT, stdio: 'inherit' });

const escape = (value) =>
    String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function main() {
    await rm(DIST, { recursive: true, force: true });
    await rm(SSR, { recursive: true, force: true });

    console.log('[static] build client');
    run(['build', '--config', 'vite.static.config.js']);

    console.log('[static] build SSR');
    run([
        'build',
        '--config',
        'vite.static.config.js',
        '--ssr',
        'resources/js/static/entry-server.jsx',
        '--outDir',
        '.ssr',
    ]);

    const profile = JSON.parse(await readFile(resolve(ROOT, 'resources/data/profile.json'), 'utf8'));

    const calendarPath = resolve(ROOT, 'resources/data/github-calendar.json');
    const github = existsSync(calendarPath) ? JSON.parse(await readFile(calendarPath, 'utf8')) : null;

    const manifest = JSON.parse(await readFile(resolve(DIST, '.vite/manifest.json'), 'utf8'));
    const entry = manifest['resources/js/static/entry-client.jsx'];
    const styles = (entry.css ?? []).map((href) => `<link rel="stylesheet" href="/${href}">`).join('\n    ');

    const { render } = await import(pathToFileURL(resolve(SSR, 'entry-server.js')).href);
    const props = { profile, github };
    const body = render(props);

    // Le domaine fait autorite : une seule adresse canonique, meme si le
    // deploiement reste joignable sur son URL .vercel.app.
    const origin = profile.seo.canonical.replace(/\/+$/, '');
    const canonical = `${origin}/`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profile.name,
        email: `mailto:${profile.email}`,
        image: origin + profile.avatar,
        jobTitle: 'Développeur full-stack & expert SEO',
        url: canonical,
        sameAs: profile.socials.map((social) => social.url),
        worksFor: {
            '@type': 'Organization',
            name: profile.agency.name,
            url: profile.agency.url,
        },
    };

    const html = `<!DOCTYPE html>
<html lang="fr" class="antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>${escape(profile.seo.title)}</title>
    <meta name="description" content="${escape(profile.seo.description)}">
    <link rel="canonical" href="${canonical}">

    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="${profile.avatar}">

    <meta property="og:type" content="profile">
    <meta property="og:title" content="${escape(profile.seo.title)}">
    <meta property="og:description" content="${escape(profile.seo.description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${origin}${profile.seo.image}">
    <meta name="twitter:card" content="summary_large_image">

    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>

    ${styles}
    <script type="module" crossorigin src="/${entry.file}"></script>
</head>
<body>
    <div id="app">${body}</div>
    <script type="application/json" id="profile-data">${JSON.stringify(props).replace(/</g, '\\u003c')}</script>
</body>
</html>
`;

    await writeFile(resolve(DIST, 'index.html'), html, 'utf8');

    // Fichiers servis tels quels, hors pipeline Vite.
    await mkdir(resolve(DIST, 'img'), { recursive: true });
    await cp(resolve(ROOT, 'public/img'), resolve(DIST, 'img'), { recursive: true });
    await cp(resolve(ROOT, 'public/favicon.svg'), resolve(DIST, 'favicon.svg'));
    await cp(resolve(ROOT, 'public/robots.txt'), resolve(DIST, 'robots.txt'));

    await rm(SSR, { recursive: true, force: true });

    console.log(
        `[static] dist/index.html ecrit (${(html.length / 1024).toFixed(1)} Ko de HTML, ` +
            `calendrier ${github ? `${github.total} contributions` : 'absent'}).`,
    );
}

await main();
