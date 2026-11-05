/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const content = app.findCollectionByNameOrId("snbm_content");
  const typeField = content.fields.getByName("type");
  const allowedTypes = Array.isArray(typeField.values) ? typeField.values.slice() : ["text", "textarea", "image"];
  if (!allowedTypes.includes("color")) {
    allowedTypes.push("color");
    typeField.values = allowedTypes;
    app.save(content);
  }

  const defaults = [
    { key: "categories_eyebrow", label: "Kategori — label bagian", type: "text", value: "FOKUS KATEGORI KAMI" },
    { key: "categories_list", label: "Kategori — satu kategori per baris", type: "textarea", value: "Fashion muslim\nFashion wanita\nTas wanita\nFashion anak\nUnderwear" },
    { key: "about_eyebrow", label: "Tentang — label bagian", type: "text", value: "01 / TENTANG SNBM" },
    { key: "about_title", label: "Tentang — judul (gunakan baris baru)", type: "textarea", value: "Koneksi yang pas.\nPotensi tanpa batas." },
    { key: "about_lead", label: "Tentang — kalimat pembuka", type: "textarea", value: "Fashion punya banyak wajah.\nBegitu juga host kami." },
    { key: "about_body_1", label: "Tentang — paragraf 1", type: "textarea", value: "Berbasis di Jakarta Barat, SNBM Creator adalah agensi host creator untuk live shopping. Kami menghubungkan kebutuhan brand dengan kategori produk, ukuran tubuh, dan gaya host—berhijab maupun nonhijab." },
    { key: "about_body_2", label: "Tentang — paragraf 2", type: "textarea", value: "Langkah kami dimulai dari Jakarta Barat, dengan visi membangun jaringan host di berbagai wilayah Indonesia. Karena koneksi yang kuat tidak mengenal batas kota." },
    { key: "workflow_eyebrow", label: "Alur kerja — label bagian", type: "text", value: "02 / CARA KAMI BEKERJA" },
    { key: "workflow_title", label: "Alur kerja — judul", type: "textarea", value: "Dari briefing\nsampai live." },
    { key: "workflow_subtitle", label: "Alur kerja — pengantar", type: "textarea", value: "Brand Anda, pendekatan yang personal.\nSeluruh proses dalam satu kolaborasi." },
    { key: "workflow_step_1_title", label: "Alur kerja — langkah 1 (judul)", type: "text", value: "Kenali brand Anda" },
    { key: "workflow_step_1_body", label: "Alur kerja — langkah 1 (deskripsi)", type: "textarea", value: "Kami mendalami kategori, karakter audiens, dan tujuan kampanye." },
    { key: "workflow_step_2_title", label: "Alur kerja — langkah 2 (judul)", type: "text", value: "Kurasi host yang relevan" },
    { key: "workflow_step_2_body", label: "Alur kerja — langkah 2 (deskripsi)", type: "textarea", value: "Reguler atau big size, hijab atau nonhijab. Sesuaikan dengan produk Anda." },
    { key: "workflow_step_3_title", label: "Alur kerja — langkah 3 (judul)", type: "text", value: "Live, evaluasi, optimalkan" },
    { key: "workflow_step_3_body", label: "Alur kerja — langkah 3 (deskripsi)", type: "textarea", value: "Presentasi produk, interaksi audiens, dan evaluasi performa untuk langkah berikutnya." },
    { key: "portfolio_title", label: "Portofolio — judul", type: "text", value: "Portofolio kolaborasi" },
    { key: "portfolio_body", label: "Portofolio — keterangan", type: "textarea", value: "Ruang untuk kampanye fashion muslim, fashion wanita, tas, fashion anak, dan underwear. Studi kasus serta logo mitra akan ditampilkan setelah mendapat izin brand—belum ada klaim kerja sama yang dipublikasikan." },
    { key: "hosts_eyebrow", label: "Host — label bagian", type: "text", value: "03 / TEMUKAN HOST ANDA" },
    { key: "hosts_title", label: "Host — judul", type: "textarea", value: "Beragam karakter.\nSatu energi." },
    { key: "hosts_cta", label: "Host — teks tombol", type: "text", value: "Jadi bagian dari tim" },
    { key: "hosts_note", label: "Host — catatan bawah", type: "textarea", value: "Foto dan profil di atas adalah ilustrasi tipe host, bukan identitas anggota aktual. Ketersediaan host dikonfirmasi saat briefing." },
    { key: "host_1_name", label: "Profil host 1 — nama", type: "text", value: "Host reguler · Hijab" },
    { key: "host_1_size", label: "Profil host 1 — ukuran", type: "text", value: "55–65 kg" },
    { key: "host_1_category", label: "Profil host 1 — kategori", type: "text", value: "Fashion muslim" },
    { key: "host_1_image", label: "Profil host 1 — URL foto", type: "image", value: "https://images.unsplash.com/photo-1685464646323-b1a5b4d30c7a?w=896&h=1216&fit=crop&q=80" },
    { key: "host_2_name", label: "Profil host 2 — nama", type: "text", value: "Host reguler · Nonhijab" },
    { key: "host_2_size", label: "Profil host 2 — ukuran", type: "text", value: "55–65 kg" },
    { key: "host_2_category", label: "Profil host 2 — kategori", type: "text", value: "Fashion wanita & tas" },
    { key: "host_2_image", label: "Profil host 2 — URL foto", type: "image", value: "https://images.unsplash.com/photo-1590926938512-c0d7e5c39abd?w=896&h=1216&fit=crop&q=80" },
    { key: "host_3_name", label: "Profil host 3 — nama", type: "text", value: "Host big size · Hijab / nonhijab" },
    { key: "host_3_size", label: "Profil host 3 — ukuran", type: "text", value: "75–100 kg" },
    { key: "host_3_category", label: "Profil host 3 — kategori", type: "text", value: "Fashion inklusif" },
    { key: "host_3_image", label: "Profil host 3 — URL foto", type: "image", value: "https://images.unsplash.com/photo-1685464646323-b1a5b4d30c7a?w=896&h=1216&fit=crop&q=80" },
    { key: "performance_eyebrow", label: "Performa — label bagian", type: "text", value: "04 / PERFORMA YANG BERARTI" },
    { key: "performance_title", label: "Performa — judul", type: "textarea", value: "Bukan sekadar live.\nAda arah. Ada target." },
    { key: "performance_intro", label: "Performa — deskripsi", type: "textarea", value: "Target dan capaian GMV per host, dengan periode dan sumber yang jelas. Karena angka yang berarti dimulai dari transparansi." },
    { key: "performance_cta", label: "Performa — teks tombol", type: "text", value: "Diskusikan target brand Anda" },
    { key: "collaborate_eyebrow", label: "CTA akhir — label bagian", type: "text", value: "LIVE BERIKUTNYA DIMULAI DARI ANDA." },
    { key: "collaborate_title", label: "CTA akhir — judul", type: "text", value: "Siap jadi" },
    { key: "collaborate_title_highlight", label: "CTA akhir — judul sorot", type: "text", value: "pusat perhatian?" },
    { key: "collaborate_brand_cta", label: "CTA akhir — tombol brand", type: "text", value: "Saya pemilik brand" },
    { key: "collaborate_host_cta", label: "CTA akhir — tombol host", type: "text", value: "Saya ingin jadi host" },
    { key: "collaborate_platform_note", label: "CTA akhir — catatan integrasi", type: "textarea", value: "Integrasi data otomatis belum aktif. Akses API dan izin akun dari masing-masing platform diperlukan; laporan saat ini dikelola oleh agensi." },
    { key: "theme_primary", label: "Tampilan — warna aksen utama", type: "color", value: "#2456ff" },
    { key: "theme_navy", label: "Tampilan — warna teks utama", type: "color", value: "#111a33" },
    { key: "theme_paper", label: "Tampilan — warna latar lembut", type: "color", value: "#f3f4f7" }
  ];

  for (const item of defaults) {
    const existing = app.findRecordsByFilter("snbm_content", "key = '" + item.key + "'");
    if (existing.length > 0) continue;
    app.save(new Record(content, item));
  }
}, () => {
  // Keep CMS records on rollback; they may contain owner-edited content.
});
