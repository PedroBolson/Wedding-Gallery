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
      includeAssets: [
        'Logo casamento_V1.png',
        'icons/icon-32.png',
        'icons/icon-48.png',
        'icons/icon-180.png',
        'icons/icon-192.png',
        'icons/icon-512.png'
      ],
      manifest: {
        name: 'Álbum Marina & Pedro',
        short_name: 'Marina & Pedro',
        description: 'Álbum de fotos do casamento de Marina e Pedro',
        theme_color: '#fff5ef',
        background_color: '#fff5ef',
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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'firebase';
            }
            if (id.includes('framer-motion')) {
              return 'motion';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
