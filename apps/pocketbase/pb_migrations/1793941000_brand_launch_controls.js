/// <reference path="../pb_data/types.d.ts" />
/**
 * Editable global brand and partnership readiness controls.
 * New records are opt-out by default; admin is the only writer.
 */
migrate((app) => {
  const collection = app.findCollectionByNameOrId('snbm_content');
  const defaults = [
    { key: 'brand_form_enabled', label: 'Kontak brand — status formulir', type: 'text', value: 'false' },
    { key: 'brand_coming_soon_title_id', label: 'Kontak brand — Coming Soon (judul Indonesia)', type: 'text', value: 'Coming Soon — Kolaborasi Brand' },
    { key: 'brand_coming_soon_title_en', label: 'Kontak brand — Coming Soon (English title)', type: 'text', value: 'Coming Soon — Brand Partnerships' },
    { key: 'brand_coming_soon_body_id', label: 'Kontak brand — deskripsi Indonesia', type: 'textarea', value: 'Kami sedang memilih dan mempersiapkan talenta host live shopping terbaik agar setiap kerja sama berjalan dengan maksimal. Formulir kerja sama brand akan kami buka setelah tim siap. Terima kasih sudah tertarik dengan SNBM Creator!' },
    { key: 'brand_coming_soon_body_en', label: 'Kontak brand — English description', type: 'textarea', value: 'We are carefully building our live-shopping host team. Brand partnership enquiries will open once our talent team is ready. Thank you for your interest in SNBM Creator!' },
    { key: 'brand_logo_icon_url', label: 'Identitas — URL logo S (header, footer, popup)', type: 'image', value: '/assets/snbm/snbm-icon-hd.png?v=sn-20261106' },
    { key: 'brand_favicon_url', label: 'Identitas — URL favicon browser', type: 'image', value: '/assets/snbm/favicon-32.png?v=sn-20261106' },
    { key: 'brand_touch_icon_url', label: 'Identitas — URL ikon Apple / mobile', type: 'image', value: '/assets/snbm/favicon-180.png?v=sn-20261106' },
    { key: 'brand_logo_font', label: 'Identitas — jenis font logo', type: 'text', value: 'Space Grotesk' },
  ];
  for (const item of defaults) {
    const existing = app.findRecordsByFilter('snbm_content', "key = '" + item.key + "'");
    if (!existing.length) app.save(new Record(collection, item));
  }
}, () => {
  // Preserve potentially owner-edited settings when rolling back an app release.
});
