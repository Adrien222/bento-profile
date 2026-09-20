import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/*
 * Build du site statique livré à Vercel.
 *
 * Deux passes, pilotées par scripts/prerender.mjs :
 *   - la passe client produit dist/assets + le manifeste
 *   - la passe SSR produit .ssr/entry-server.js, executé au build pour
 *     écrire le HTML
 *
 * emptyOutDir reste à false : les deux passes cohabitent, et c'est le script
 * de pré-rendu qui nettoie dist/ avant de commencer.
 */
export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        manifest: true,
        emptyOutDir: false,
        outDir: 'dist',
        rollupOptions: {
            input: 'resources/js/static/entry-client.jsx',
        },
    },
});
