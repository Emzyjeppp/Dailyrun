# Dailyrun - Strava Running Streak Tracker

Aplikasi web pelacak konsistensi streak lari harian untuk atlet Strava **Jepri Muhammad**, dilengkapi bukti tangkapan layar Strava asli, proteksi pemilik, dan mode pratinjau publik (POV Orang Lain).

## Fitur Utama

1. **Pencatatan Lari Harian**
   - Unggah tangkapan layar Strava asli (disimpan di IndexedDB berkapasitas besar).
   - Input metrik: Judul sesi, tanggal, waktu mulai, jarak (km), durasi (menit/detik), elevasi gain, detak jantung, dan catatan latihan.
   - Perhitungan pace otomatis (`mm:ss /km`).

2. **Perhitungan Streak Harian Otomatis**
   - Menghitung streak aktif secara berkesinambungan.
   - Melacak rekor streak terpanjang (*longest streak*).
   - Total jarak tempuh (km) dan total sesi lari.
   - Status indikator hari ini (*Streak Hari Ini Terpenuhi* atau *Belum Lari Hari Ini*).

3. **Mode Pratinjau Publik (POV Orang Lain)**
   - Saat tautan dibagikan ke orang lain, tampilan terkunci pada mode baca (*read-only*).
   - Pengunjung luar tidak dapat menambah, mengubah, atau menghapus catatan lari.
   - **Tekan SS untuk Info Lengkap:** Pada kartu aktivitas, pengunjung cukup menekan tangkapan layar Strava untuk membuka modal inspeksi dengan bukti gambar asli dan statistik lengkap.

4. **Proteksi Akses Pemilik**
   - Mode kelola (tambah, ubah, hapus) dilindungi oleh PIN pemilik.
   - Sesi pemilik tersimpan pada peramban pribadi Anda.

5. **Palet Warna Resmi Strava**
   - Mengikuti skema warna resmi Strava: Oranye Strava (`#FC4C01`), Dark (`#242428`), Background (`#F7F7FA`), dan Accent Green (`#59A51D`).

6. **Kepatuhan Tanpa Emoji**
   - Antarmuka dan kode menggunakan ikon SVG dari Lucide React tanpa simbol dekoratif unicode atau karakter emoji.

## Cara Menjalankan Secara Lokal

### Prasyarat
- Node.js versi 18 atau lebih baru.
- npm.

### Menjalankan Server Pengembangan
```bash
npm install
npm run dev
```
Buka `http://localhost:5173` pada peramban Anda.

### Kompilasi Produksi
```bash
npm run build
```
Hasil build berada di direktori `dist/`.

## Struktur Repositori dan Komunitas
- [LICENSE](LICENSE): Lisensi MIT.
- [CONTRIBUTING.md](CONTRIBUTING.md): Panduan kontribusi.
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md): Pedoman perilaku komunitas.
- [SECURITY.md](SECURITY.md): Kebijakan pelaporan keamanan.
