/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let collection;
    try {
      collection = app.findCollectionByNameOrId("snbm_content");
    } catch (_) {
      collection = new Collection({
        type: "base",
        name: "snbm_content",
        // Public read (landing-page content is served to everyone); admin-only writes.
        listRule: "",
        viewRule: "",
        createRule: "@request.auth.role = 'admin'",
        updateRule: "@request.auth.role = 'admin'",
        deleteRule: "@request.auth.role = 'admin'",
        fields: [
          { name: "key", type: "text", required: true, max: 100 },
          { name: "label", type: "text", max: 200 },
          { name: "type", type: "select", required: true, maxSelect: 1, values: ["text", "textarea", "image"] },
          { name: "value", type: "text", max: 2000 },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
        indexes: [
          "CREATE UNIQUE INDEX idx_snbm_content_key ON snbm_content (key) WHERE key != ''",
        ],
      });
      app.save(collection);
    }
  },
  (app) => {
    try { app.delete(app.findCollectionByNameOrId("snbm_content")); } catch (_) {}
  },
);
