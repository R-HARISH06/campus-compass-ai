const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });

async function fixDuplicates() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });

    console.log("Removing duplicate events...");
    await connection.query(`
      DELETE e1 FROM events e1
      INNER JOIN events e2 
      WHERE e1.id > e2.id 
      AND e1.title = e2.title 
      AND e1.date = e2.date;
    `);

    console.log("Adding unique constraint to events...");
    try {
      await connection.query(`ALTER TABLE events ADD UNIQUE KEY unique_event (title, date)`);
    } catch (e) {
      // Ignore if already exists
    }

    console.log("Removing duplicate clubs...");
    await connection.query(`
      DELETE c1 FROM clubs c1
      INNER JOIN clubs c2 
      WHERE c1.id > c2.id 
      AND c1.name = c2.name;
    `);

    console.log("Adding unique constraint to clubs...");
    try {
      await connection.query(`ALTER TABLE clubs ADD UNIQUE KEY unique_club (name)`);
    } catch (e) {
      // Ignore if already exists
    }

    console.log("Duplicates removed and constraints added!");
    process.exit(0);
  } catch (err) {
    console.error("Error fixing duplicates:", err);
    process.exit(1);
  }
}

fixDuplicates();
