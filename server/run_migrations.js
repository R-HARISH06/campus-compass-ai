const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

async function runMigrations() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });

    const schemaPath = path.join(__dirname, "config", "schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");

    console.log("Running schema.sql...");
    await connection.query(sql);
    
    // Also promote the user to master_admin
    await connection.query("UPDATE users SET role = 'master_admin' WHERE email = 'harish@saranathan.ac.in' OR id = 1");

    console.log("Migrations applied successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigrations();
