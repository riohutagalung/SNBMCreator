/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const email = ($os.getenv("SNBM_ADMIN_EMAIL") || "").trim().toLowerCase();
  const password = $os.getenv("SNBM_ADMIN_PASSWORD") || "";

  if (!email || !password) {
    throw new Error("Set SNBM_ADMIN_EMAIL and SNBM_ADMIN_PASSWORD before starting PocketBase.");
  }
  if (password.length < 14) {
    throw new Error("SNBM_ADMIN_PASSWORD must be at least 14 characters.");
  }

  // Remove the old publicly-known demo account if it was created by an earlier
  // version of this migration. This closes the credential disclosed in Git history.
  try {
    const legacy = app.findAuthRecordByEmail("users", "admin@snbmcreator.id");
    app.delete(legacy);
  } catch (_) {}

  const users = app.findCollectionByNameOrId("users");
  let admin;
  try {
    admin = app.findAuthRecordByEmail("users", email);
  } catch (_) {
    admin = new Record(users);
    admin.set("email", email);
  }

  admin.set("name", "Admin SNBM Creator");
  admin.set("role", "admin");
  admin.set("password", password);
  app.save(admin);
}, () => {
  // Intentionally do not delete the admin on rollback. Account lifecycle is
  // managed by the owner, not by schema rollback.
});
