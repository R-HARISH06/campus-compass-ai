const bcrypt = require("bcryptjs");
const pool = require("./db");

async function seedDemoAccounts() {
  const accounts = [
    { name: "Master Admin", email: "master@admin.com", role: "master_admin" },
    { name: "Data Admin", email: "data@admin.com", role: "data_admin" },
    { name: "Club Admin", email: "club@admin.com", role: "club_admin" },
    { name: "Cafe Owner", email: "cafe@admin.com", role: "cafe_owner" },
    { name: "Demo Faculty", email: "faculty@admin.com", role: "faculty" },
    { name: "Demo Student", email: "student@admin.com", role: "student" },
  ];

  try {
    const hashedPassword = await bcrypt.hash("password123", 10);

    for (const acc of accounts) {
      const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [acc.email]);
      
      if (existing.length === 0) {
        await pool.query(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
          [acc.name, acc.email, hashedPassword, acc.role]
        );
        console.log(`Created ${acc.role} account: ${acc.email} / password123`);
      } else {
        await pool.query(
          "UPDATE users SET role = ?, password = ? WHERE email = ?",
          [acc.role, hashedPassword, acc.email]
        );
        console.log(`Updated existing account to ${acc.role}: ${acc.email} / password123`);
      }
    }

    console.log("Demo accounts seeded successfully.");
  } catch (error) {
    console.error("Error seeding demo accounts:", error);
  } finally {
    process.exit(0);
  }
}

seedDemoAccounts();
