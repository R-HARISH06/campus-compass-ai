const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

async function reset() {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const hash = await bcrypt.hash("password123", 12);
  
  // Reset Harish R
  await c.query("UPDATE users SET password = ? WHERE email = 'harishravi2186@gmail.com'", [hash]);
  
  // Insert harish@saranathan.ac.in if it doesn't exist
  try {
    await c.query("INSERT INTO users (name, email, password, role) VALUES ('Admin Harish', 'harish@saranathan.ac.in', ?, 'master_admin')", [hash]);
  } catch(e) {
    // If it exists, update it
    await c.query("UPDATE users SET password = ?, role = 'master_admin' WHERE email = 'harish@saranathan.ac.in'", [hash]);
  }

  console.log("Password reset successfully. You can now login with password123");
  process.exit(0);
}
reset();
