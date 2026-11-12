# SNBM Creator — sinkronisasi Host ke Google Sheets dan Google Drive

Hanya untuk tab **Pendaftaran Host**. Alur Brand yang sudah ada tidak diubah.

## Tujuan
1. Host mengirim formulir pada website; server menyimpan data dan berkas privat di Supabase.
2. Server mengirim metadata + **URL unduhan sementara, hanya server-ke-server** ke Apps Script Host.
3. Apps Script menyalin CV/video ke folder **Google Drive privat**, lalu menulis baris Host di Google Sheets.
4. Kolom Q (CV) dan R (Video) menyimpan **link file Google Drive permanen** (tanpa token JWT di sel).
5. Setiap ID pendaftaran hanya satu baris; Status Seleksi dan Catatan HR tidak tertimpa.
6. Sinkronisasi gagal tidak menghapus data di Supabase. Tombol **Sinkronkan Google Sheets** di /admin mencoba lagi.

## Aktivasi (diperlukan karena konektor GitHub tidak dapat mengubah deployment Apps Script Anda)
- Buka [script.google.com](https://script.google.com) dan buat **proyek baru** khusus Host (jangan timpa project Brand).
- Ganti isi `Code.gs` dengan isi `HostDriveSync.gs` di folder ini.
- Di **Project Settings → Script Properties**, tambahkan `SNBM_SHEETS_API_TOKEN` bernilai **persis sama** dengan Hostinger (minimal 32 karakter). Jangan menaruh token di kode atau GitHub.
- Opsional: `SNBM_HOST_FOLDER_ID` untuk folder Drive privat yang sudah ada; jika tidak ada, script membuat folder privat sendiri saat verifikasi pertama.
- Jalankan `verifyHostIntegration()` sekali dari editor, lalu selesaikan dialog izin Sheets, Google Drive, dan URL Fetch.
- **Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone**. Akses API tetap divalidasi dengan token server; berkas Drive tetap privat.
- Salin URL `/exec` ke Hostinger Environment variable `SNBM_HOST_DRIVE_WEBAPP_URL`, lalu **redeploy website**. Jangan mengganti `SNBM_SHEETS_WEBAPP_URL`: endpoint lama tetap dipakai untuk Brand.
- Dari dashboard admin `/admin`, tekan **Sinkronkan Google Sheets** untuk pendaftaran yang tertunda. Periksa kolom Q/R serta buka dokumen menggunakan akun Google pemilik folder atau yang diberikan akses.
- Jika tim lain perlu membaca berkas, bagikan folder Drive **hanya kepada akun Google tim tersebut**, bukan akses publik.

## Penting
- Script mendownload file dari Supabase selama URL sumber masih hidup (10 menit), lalu menyalinnya ke Drive. URL sementara tidak disimpan ke Sheets dan akan kedaluwarsa sendiri.
- Link Drive tidak mempunyai JWT kedaluwarsa. Namun, akses tetap mengikuti izin Drive; file yang dihapus, dipindahkan ke Trash, atau izin aksesnya dicabut tidak bisa dibuka.
- Apps Script UrlFetch punya batas ukuran respons sekitar 50 MB. Video yang mendekati batas tersebut mungkin perlu upload alternatif; data tetap di Supabase jika sinkronisasi gagal.
- Sinkronisasi otomatis pada submission baru berjalan setelah deployment Apps Script Host dan variabel Hostinger diaktifkan. Jangan menganggap perubahan GitHub saja telah mengaktifkan integrasi live.
