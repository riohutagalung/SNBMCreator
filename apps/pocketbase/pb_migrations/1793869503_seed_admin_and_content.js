/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // The admin account is provisioned by 1793869600_secure_admin_bootstrap.js
    // using SNBM_ADMIN_EMAIL and SNBM_ADMIN_PASSWORD. Never commit credentials.

    // Seed the first editable landing-page fields. New CMS fields are added by
    // 1793869601_expand_homepage_cms.js. Existing values are intentionally kept.
    const content = app.findCollectionByNameOrId("snbm_content");
    const defaults = [
      { key: "hero_title", label: "Judul utama (baris 1)", type: "text", value: "Host yang tepat." },
      { key: "hero_title_highlight", label: "Judul utama (sorot biru)", type: "text", value: "makin hebat." },
      { key: "hero_intro", label: "Teks pengantar hero", type: "textarea", value: "Kami mempertemukan brand fashion dengan host creator yang relevan. Bukan hanya menjual produk—membangun koneksi yang menggerakkan penjualan." },
      { key: "hero_image", label: "Gambar hero (URL)", type: "image", value: "https://images.unsplash.com/photo-1631821657340-b07983bfc5f9?w=1344&h=768&fit=crop&q=80" },
      { key: "hero_caption", label: "Keterangan gambar hero", type: "text", value: "Beragam gaya." },
      { key: "hero_caption_strong", label: "Keterangan gambar hero (tebal)", type: "text", value: "Satu dampak nyata." },
    ];
    for (const d of defaults) {
      const existing = app.findRecordsByFilter("snbm_content", `key = '${d.key}'`);
      if (existing.length > 0) continue;
      app.save(new Record(content, d));
    }
  },
  () => {
    // Keep editable content on rollback; it may contain the owner's copy.
  },
);
