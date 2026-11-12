# SNBM Creator — integrasi Google Drive di Apps Script yang sudah ada

**Tidak perlu Web App baru.** Gunakan deployment tetap:
https://script.google.com/macros/s/AKfycbyfAs-Ic_P4_FvmA3KlMTsbbd_z5AgBV-LVqQQ7p8nlT6gd7jAOkPFkFruiGhBa7S7acA/exec

## Pasang di Apps Script yang sudah digunakan
1. Buka project Apps Script yang memegang deployment di atas.
2. Jangan hapus atau timpa `Code.gs` lama; fungsi `doPost`, `mapBrand_`, `upsert_`, filter, dan styling Brand tetap dipakai.
3. Tambahkan file script baru bernama `HostDriveSync.gs`. Tempel seluruh isi `HostDriveSync.gs` dari folder ini.
4. Di `Code.gs` lama, cari **satu baris**:

   `const row = isHost ? mapHost_(record) : mapBrand_(record);`

   Ubah menjadi:

   `const row = isHost ? mapHost_(archiveHostFiles_(record)) : mapBrand_(record);`

5. Opsional tetapi dianjurkan: ubah judul header Q/R dari `CV — Path Privat di Supabase` dan `Video Upload — Path Privat di Supabase` menjadi `CV — Google Drive` dan `Video — Google Drive` **hanya setelah** logika baru berfungsi. Jika mengubah array `HOST_COLUMNS`, ubah juga header Q1/R1 sebelum menjalankan `verifySNBMSheets()`, karena fungsi setup lama akan menolak ketidakcocokan header. **Jangan jalankan setup ulang hanya untuk langkah ini.**
6. Dari Project Settings pastikan Script Property `SNBM_SHEETS_API_TOKEN` masih sama dengan Hostinger; token tidak perlu diganti.
7. Jalankan `verifySNBMHostDrive()` sekali agar izin Drive diminta dan folder privat dibuat. Script Property `SNBM_HOST_FOLDER_ID` akan dibuat otomatis; bisa juga ditetapkan ke folder privat yang sudah ada.
8. **Deploy > Manage deployments > Edit > Version: New version > Deploy**. URL deployment **tetap**.
9. Setelah website Hostinger selesai memperbarui kode GitHub, dari dashboard /admin gunakan **Sinkronkan Google Sheets** untuk memasukkan pendaftaran yang masih tertunda.

## Cara kerja
- Backend tetap menyimpan form dan file di Supabase; ini menjadi backup jika sinkronisasi Drive gagal.
- Saat ada pendaftaran Host, server membuat tautan sementara 10 menit **hanya untuk transmisi backend-ke-Apps Script**.
- Apps Script mengambil berkas sekali, menyimpannya ke folder Drive privat, dan mengganti kolom Q/R dengan URL Drive permanen. **Sel tidak berisi URL token JWT**.
- File Drive hanya dapat dibuka oleh pemilik atau orang yang diberi izin di Drive. Link tidak kedaluwarsa, selama file dan akses masih ada.
- Pengiriman ulang menggunakan ID pendaftaran dan nama file yang tetap, sehingga tidak membuat baris atau file ganda. Kolom status dan catatan manual dipertahankan.
- Brand dan tab Kerja Sama Brand tetap menggunakan logika sebelumnya.
- File yang sudah ada di Supabase namun pernah disinkronkan sebelum integrasi ini perlu sinkronisasi ulang secara terkontrol agar link lamanya diganti. Pendaftaran yang masih pending bisa disinkronkan lewat /admin.
- Video mendekati 50 MB dapat terkena batas ukuran atau waktu eksekusi Apps Script. Jika terjadi, backend akan mempertahankan data di Supabase dan menandai sinkronisasi belum selesai, bukan menghapus berkas.

## Jangan
- Jangan mempublikasikan folder Drive untuk `Anyone with the link`; data pelamar bersifat pribadi.
- Jangan menyalin token API atau signed URL ke source GitHub, log, ataupun Google Sheets.
- Jangan mengganti atau menimpa `doPost` versi lama dengan `doPost` baru.
