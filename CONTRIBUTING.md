# Panduan Kontribusi

Terima kasih telah tertarik untuk berkontribusi pada proyek Dailyrun. Berikut adalah langkah sederhana untuk mengajukan perbaikan bug atau fitur baru.

## Alur Kerja

1. Fork repositori ini ke akun GitHub Anda.
2. Buat branch baru dari `main` dengan nama deskriptif (misal: `feat/streak-chart` atau `fix/pace-calc`).
3. Jalankan aplikasi secara lokal dan pastikan pengujian lulus:
   ```bash
   npm install
   npm run dev
   npm run build
   ```
4. Buat perubahan kode yang bersih, fokus pada satu tujuan, dan patuhi standar tanpa emoji.
5. Commit perubahan menggunakan format konvensional nyancodeid (`feat:`, `fix:`, `docs:`, dll).
6. Buka Pull Request ke branch `main` dengan deskripsi jelas mengenai perubahan yang dibuat.

## Standar Kode

- Pastikan tipe data TypeScript valid tanpa error (`tsc --noEmit`).
- Desain mengikuti palet resmi Strava (#FC4C01, #242428, dll).
- Dilarang menggunakan karakter emoji atau simbol dekoratif unicode pada kode, UI, dan commit.
