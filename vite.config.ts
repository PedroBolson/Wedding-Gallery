import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['Logo casamento_V1.png'],
      manifest: {
        name: 'Álbum Marina & Pedro',
        short_name: 'Marina & Pedro',
        description: 'Álbum de fotos do casamento de Marina e Pedro',
        theme_color: '#ff8f77',
        background_color: '#fefdfb',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/Logo casamento_V1.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/Logo casamento_V1.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/Logo casamento_V1.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'firebase-images-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})
