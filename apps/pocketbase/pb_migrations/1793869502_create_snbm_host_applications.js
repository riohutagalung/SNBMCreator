/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let collection;
    try {
      collection = app.findCollectionByNameOrId("snbm_host_applications");
    } catch (_) {
      collection = new Collection({
        type: "base",
        name: "snbm_host_applications",
        // Anonymous visitors submit; only the admin reads them.
        listRule: "@request.auth.role = 'admin'",
        viewRule: "@request.auth.role = 'admin'",
        createRule: "",
        updateRule: "@request.auth.role = 'admin'",
        deleteRule: "@request.auth.role = 'admin'",
        fields: [
          { name: "name", type: "text", required: true, max: 120 },
          { name: "email", type: "email", required: true },
          { name: "phone", type: "text", required: true, max: 30 },
          { name: "city", type: "text", max: 120 },
          { name: "employment_type", type: "select", required: true, maxSelect: 1, values: ["Full time", "Freelance"] },
          { name: "size_type", type: "select", required: true, maxSelect: 1, values: ["Reguler (55-65 kg)", "Big size (75-100 kg)"] },
          { name: "style", type: "select", maxSelect: 1, values: ["Hijab", "Nonhijab", "Bisa keduanya"] },
          { name: "weight", type: "number", min: 0, max: 200 },
          { name: "category", type: "text", max: 200 },
          { name: "experience", type: "text", max: 2000 },
          { name: "portfolio_url", type: "url", max: 500 },
          { name: "consent", type: "bool", required: true },
          { name: "status", type: "select", maxSelect: 1, values: ["baru", "ditinjau", "diterima", "ditolak"] },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
      });
      app.save(collection);
    }
  },
  (app) => {
    try { app.delete(app.findCollectionByNameOrId("snbm_host_applications")); } catch (_) {}
  },
);
