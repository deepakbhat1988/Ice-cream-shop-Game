import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          name: 'Saanvi Ice Cream Shop',
          short_name: 'SaanviShop',
          description: 'An ice cream shop game for kids',
          theme_color: '#1A1A1A',
          background_color: '#1A1A1A',
          display: 'standalone',
          orientation: 'landscape',
          start_url: '/Ice-cream-shop-Game/',
          scope: '/Ice-cream-shop-Game/',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,png,jpg,svg,woff2}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
      }),
    ],
    base: '/Ice-cream-shop-Game/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});