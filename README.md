# RockPaperScissors App

## Pengantar

Starter Project RockPaperScissors adalah aplikasi web yang mampu membedakan gambar yang terlihat pada kamera (webcam) pengguna. Gambar yang dapat dibedakan adalah Batu (Rock), Kertas (Paper), Gunting (Scissors). Dengan kemampuan pengolahan data Computer Vision pada platform browser.

## Table of Contents

- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Project Structure](#project-structure)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (disarankan versi 12 atau lebih tinggi)
- [npm](https://www.npmjs.com/) (Node package manager)
- [TensorFlow.js](https://www.npmjs.com/package/@tensorflow/tfjs)

### Installation

1. Download starter project [di sini]().
2. Lakukan unzip file.
3. Pasang seluruh dependencies dengan perintah berikut.
   ```shell
   npm install
   ```

## Scripts

- Build for Production:

  ```shell
  npm run build
  ```

  Script ini menjalankan webpack dalam mode production menggunakan konfigurasi `webpack.prod.js` dan menghasilkan sejumlah file build ke direktori `dist`.

- Start Development Server:

  ```shell
  npm run start-dev
  ```

  Script ini menjalankan server pengembangan webpack dengan fitur live reload dan mode development sesuai konfigurasi di`webpack.dev.js`.

- Serve:
  ```shell
  npm run serve
  ```
  Script ini menggunakan [`http-server`](https://www.npmjs.com/package/http-server) untuk menyajikan konten dari direktori `dist`.

## Project Structure

Proyek ini dirancang agar kode tetap modular dan terorganisir.

```text
a882-ai-on-web-labs/
├── src/                    # Folder utama berisi semua source code.
│   ├── index.html          # File HTML utama sebagai entry point halaman web.
│   ├── public/             # Aset statis yang tidak diproses oleh Webpack.
│   │   └── favicon.png     # Ikon untuk tab browser.
│   ├── scripts/            # Berisi semua file JavaScript.
│   │   ├── app.js          # Kelas utama untuk View, mengatur DOM dan event.
│   │   ├── app-presenter.js# Kelas Presenter yang menjadi jembatan antara View dan Model.
│   │   ├── index.js        # File JavaScript utama sebagai entry point aplikasi.
│   └── styles/             # Berisi file-file styling (CSS).
│       └── styles.css      # File styling utama.
├── .gitignore              # Konfigurasi untuk mengabaikan file/folder dari Git.
├── package.json            # Menyimpan metadata proyek, dependensi, dan skrip npm.
├── package-lock.json       # Merekam versi pasti dari setiap dependensi.
├── README.md               # Dokumentasi proyek.
├── webpack.common.js       # Konfigurasi Webpack yang umum untuk development dan production.
├── webpack.dev.js          # Konfigurasi Webpack khusus untuk mode development.
└── webpack.prod.js         # Konfigurasi Webpack khusus untuk mode production.
```
