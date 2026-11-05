/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // --- seed the admin account (closed sign-up; only migrations create users) ---
    const users = app.findCollectionByNameOrId("users");
    const existingAdmins = app.findRecordsByFilter("users", "email = 'admin@snbmcreator.id'");
    if (existingAdmins.length === 0) {
      const admin = new Record(users, {
        email: "admin@snbmcreator.id",
        name: "Admin SNBM Creator",
        role: "admin",
      });
      admin.set("password", "SnbmCreator2026!");
      app.save(admin);
    }

    // --- seed default editable landing-page content ---
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
      const rec = new Record(content, d);
      app.save(rec);
    }
  },
  () => {
    // down: leave seeded records in place (re-running up is idempotent).
  },
);
