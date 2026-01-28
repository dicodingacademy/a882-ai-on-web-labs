import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,json,bin}'
        ],
        additionalManifestEntries: [
          { url: '/model/model.json', revision: '1.0.0' },
          { url: '/model/metadata.json', revision: '1.0.0' },
          { url: '/model/weights.bin', revision: '1.0.0' }
        ],
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50MB
        skipWaiting: true,
        clientsClaim: true
      },
      manifest: {
        name: 'NutriVision - AI Food Recognition',
        short_name: 'NutriVision',
        description: 'Aplikasi AI untuk mengenali makanan dan memberikan informasi nutrisi',
        theme_color: '#27ae60',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: '/screenshots/screenshot1.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Home screen with camera preview'
          },
          {
            src: '/screenshots/screenshot2.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Detection result with nutrition info'
          }
        ]
      }
    })
  ],

  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'tensorflow': ['@tensorflow/tfjs', '@tensorflow/tfjs-backend-webgpu'],
          'transformers': ['@xenova/transformers']
        }
      }
    }
  },
  server: {
    port: 3001,
    host: true
  }
});