/**
 * Build des Kochbuchs (Preact + TypeScript).
 *   npm run dev    Entwicklungsserver (http://localhost:5175)
 *   npm run build  PWA nach dist/app (GitHub Pages: /kochbuch/app/)
 * Die Rezepte sind nicht im Build: Jedes Gerät lädt rezepte.json selbst (siehe README).
 */
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';

const root = fileURLToPath(new URL('./web', import.meta.url));

export default defineConfig({
  root,
  base: './',
  plugins: [
    preact(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['icon.svg', 'icon-192.png'],
      manifest: {
        name: 'Kochbuch',
        short_name: 'Kochbuch',
        description: 'Rezepte nach Art, Saison und Verträglichkeit filtern, Portionen umrechnen und Zutaten auf den Einkaufszettel setzen.',
        lang: 'de-CH',
        id: './',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#edf1f0',
        theme_color: '#edf1f0',
        categories: ['food', 'lifestyle'],
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
        shortcuts: [
          { name: 'Einkaufszettel', url: './#/einkauf', icons: [{ src: 'icon-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
  build: {
    outDir: fileURLToPath(new URL('./dist/app', import.meta.url)),
    emptyOutDir: true,
    target: 'es2022',
  },
  // Die gemeinsame Basis (Schriften, Farben) liegt ausserhalb des App-Ordners in ../gemeinsam
  server: { port: 5175, fs: { allow: [fileURLToPath(new URL('.', import.meta.url)), fileURLToPath(new URL('../gemeinsam', import.meta.url))] } },
});
