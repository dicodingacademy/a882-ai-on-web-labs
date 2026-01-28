# NutriVision

Aplikasi AI pengenalan makanan berbasis React + Vite.

## Fitur

- Klasifikasi gambar makanan menggunakan TensorFlow.js MobileNet
- Generasi informasi nutrisi menggunakan Transformers.js LaMini-Flan-T5-77M
- Kamera real-time untuk pengambilan gambar
- PWA dengan offline support

## Struktur

```
├── public/                 # Aset statis
│   ├── icons/             # Ikon PWA
│   ├── model/             # File model TensorFlow.js
│   ├── screenshots/       # Screenshot aplikasi untuk prompt install PWA
│   └── favicon.ico
├── src/
│   ├── components/        # Komponen React
│   │   ├── CameraSection.jsx
│   │   ├── Header.jsx
│   │   └── InfoPanel.jsx
│   ├── hooks/             # Custom React hooks
│   │   └── useAppState.js
│   ├── services/          # Modul layanan AI
│   │   ├── CameraService.js
│   │   ├── DetectionService.js
│   │   └── NutritionService.js
│   ├── utils/             # Fungsi utilitas
│   │   ├── common.js
│   │   ├── config.js
│   │   └── ui.js
│   ├── App.jsx            # Komponen utama aplikasi
│   ├── main.jsx           # Entry point aplikasi
│   └── index.css          # Style global
├── package.json
├── vite.config.js
└── eslint.config.js
```

## Cara Menggunakan

```bash
cd react-version
npm install
npm run dev     # Development server di http://localhost:3001
npm run build   # Build untuk production
```

## AI Models

| Model | Fungsi |
|-------|--------|
| TensorFlow.js MobileNet | Klasifikasi gambar makanan |
| Transformers.js LaMini-Flan-T5-77M | Generasi deskripsi nutrisi |

## Konfigurasi PWA

Manifest di-generate otomatis oleh VitePWA dari `vite.config.js`. Lihat konfigurasi `manifest` di [`vite.config.js`](vite.config.js).

### Konfigurasi Transformers.js untuk Vite

Transformers.js memerlukan konfigurasi khusus saat digunakan dengan Vite karena perbedaan perilaku bundler:

```javascript
import { env } from '@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;
```

**Mengapa `env.allowLocalModels = false`?**

Vite melakukan pre-bundling dependencies yang mengubah struktur file. Ketika `allowLocalModels = true`, Transformers.js mencoba memuat model dari file lokal (seperti yang dibundel), yang menyebabkan:
- **Path resolution error**: Vite mengubah path file dalam node_modules
- **File tidak ditemukan**: Model files (onnx, json, shard files) tidak berada di lokasi yang diharapkan
- **JSON parse error**: Transformers.js gagal membaca metadata model karena path berubah

Dengan `allowLocalModels = false`, paksa Transformers.js untuk selalu mengunduh model dari Hugging Face Hub, menghindari masalah path resolution dengan file yang dibundel.

**Mengapa `env.useBrowserCache = true`?**

- **Hugging Face Hub Cache**: Model yang diunduh disimpan di browser cache (IndexedDB)
- **Load kedua lebih cepat**: Tidak perlu unduh ulang model (~77MB)
- **Offline support**: Model tersedia setelah cache pertama
- **Workbox integration**: VitePWA's Workbox juga melakukan caching pada level HTTP

**Perbedaan Vite vs Webpack:**

| Aspek | Webpack | Vite |
|-------|---------|------|
| Model Loading | Static file imports | Pre-bundled dependencies |
| ONNX Files | Di-serve langsung | Perlu konfigurasi khusus |
| Cache Strategy | Manual | Built-in browser cache |
| Path Resolution | Stabil | Berubah saat dev |
