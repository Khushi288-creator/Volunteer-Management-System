const Admin = require("../models/admin");

const seedAdmin = async () => {
  try {
    const existing = await Admin.findOne();
    if (existing) return;

    const email = process.env.ADMIN_EMAIL || "admin@volunteerhub.org";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    await Admin.create({ email, password, name: "VolunteerHub Admin" });
    console.log(`Default admin seeded: ${email}`);
  } catch (error) {
    console.error("Admin seed error:", error.message);
  }
};

module.exports = seedAdmin;
