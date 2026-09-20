import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

/*
 * La page tient sur des piles système : aucune police n'est téléchargée, donc
 * aucune requête bloquante et pas de décalage de rendu au chargement.
 *
 * Pour passer sur une vraie grotesque plus proche de la maquette de référence,
 * réactive le plugin de polices et pointe --font-display dessus dans app.css :
 *
 *   import { bunny } from 'laravel-vite-plugin/fonts';
 *   fonts: [bunny('Archivo', { weights: [400, 500, 700] })]
 */
export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
