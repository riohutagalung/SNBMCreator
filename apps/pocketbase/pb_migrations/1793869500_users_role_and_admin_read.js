/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // --- users: add privileged `role` field, close public sign-up, lock role ---
    const users = app.findCollectionByNameOrId("users");
    let hasRole = false;
    try { users.fields.getByName("role"); hasRole = true; } catch (_) {}
    if (!hasRole) {
      users.fields.add(new SelectField({
        name: "role",
        required: true,
        maxSelect: 1,
        values: ["admin", "member"],
      }));
    }
    // Closed sign-up: accounts are seeded via migration only.
    users.createRule = null;
    // A member may edit only their own row and may NOT change role; admins may edit anyone.
    users.updateRule = "(id = @request.auth.id && @request.body.role:isset = false) || @request.auth.role = 'admin'";
    app.save(users);

    // --- snbm_enquiries: let the admin read submissions ---
    const enquiries = app.findCollectionByNameOrId("snbm_enquiries");
    enquiries.listRule = "@request.auth.role = 'admin'";
    enquiries.viewRule = "@request.auth.role = 'admin'";
    app.save(enquiries);

    // --- snbm_contacts: let the admin read newsletter sign-ups ---
    const contacts = app.findCollectionByNameOrId("snbm_contacts");
    contacts.listRule = "@request.auth.role = 'admin'";
    contacts.viewRule = "@request.auth.role = 'admin'";
    app.save(contacts);
  },
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    try { users.fields.removeByName("role"); } catch (_) {}
    users.createRule = "";
    users.updateRule = "id = @request.auth.id";
    app.save(users);

    const enquiries = app.findCollectionByNameOrId("snbm_enquiries");
    enquiries.listRule = null;
    enquiries.viewRule = null;
    app.save(enquiries);

    const contacts = app.findCollectionByNameOrId("snbm_contacts");
    contacts.listRule = null;
    contacts.viewRule = null;
    app.save(contacts);
  },
);
