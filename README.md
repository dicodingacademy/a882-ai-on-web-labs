# Latihan Modul 3: Generator Puisi AI

Aplikasi web sederhana untuk menghasilkan puisi kreatif menggunakan AI.

## Cara Menggunakan

### Menjalankan Aplikasi (VS Code Live Server)
1. Install extension "Live Server" di VS Code
2. Klik kanan pada file `index.html`
3. Pilih "Open with Live Server"
4. Aplikasi akan terbuka di browser secara otomatis

### Alternatif Server Lain
```bash
# Node.js live-server
npx live-server
```

## Penggunaan

1. **Tunggu Loading**: Model AI akan dimuat otomatis (sekali saja)
2. **Masukkan Tema**: Ketik tema puisi yang diinginkan
3. **Generate**: Klik "Buat Puisi" 
4. **Salin**: Gunakan tombol copy untuk menyalin hasil

## Struktur File

```
├── index.html          # Halaman utama
├── styles.css          # Styling aplikasi
├── script.js           # Logika aplikasi dan AI
└── README.md           # Dokumentasi
```

## Teknologi

- **HTML5 & CSS3**: Interface responsif
- **JavaScript**: Logika aplikasi
- **Transformers.js**: Library AI untuk browser
- **AI Model**: LaMini-Flan-T5-77M untuk generasi teks

## Persyaratan

- Browser modern (Chrome, Firefox, Safari, Edge)
- Koneksi internet (untuk download model pertama kali)
- Server lokal untuk menjalankan aplikasi

## Troubleshooting

### Error CORS
Pastikan menjalankan melalui server HTTP, bukan membuka file langsung di browser.

### Model Tidak Bisa Dimuat
- Periksa koneksi internet
- Refresh halaman jika loading gagal
- Pastikan browser mendukung JavaScript modern

## Lisensi

MIT License - Bebas digunakan dan dimodifikasi.