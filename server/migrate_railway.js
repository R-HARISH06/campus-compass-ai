const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  console.log("Connecting to Railway MySQL...");
  
  const connection = await mysql.createConnection({
    host: 'altaria.proxy.rlwy.net',
    port: 30633,
    user: 'root',
    password: 'KGCCmqsUKtZujRZsMHmGmwWBVJksosFv',
    database: 'railway',
    multipleStatements: true
  });

  try {
    console.log("Connected successfully! Running schema.sql...");
    const schemaPath = path.join(__dirname, 'config', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSql);
    console.log("Schema created successfully.");

    console.log("Running seed_data.sql...");
    const seedPath = path.join(__dirname, 'config', 'seed_data.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await connection.query(seedSql);
    console.log("Basic data seeded successfully.");
    
    // Also run faculty seed if needed
    console.log("Running seed_faculty.sql...");
    const facultyPath = path.join(__dirname, 'config', 'seed_faculty.sql');
    if (fs.existsSync(facultyPath)) {
      const facultySql = fs.readFileSync(facultyPath, 'utf8');
      await connection.query(facultySql);
      console.log("Faculty seeded successfully.");
    }

    console.log("All migrations completed on Railway!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await connection.end();
  }
}

runMigration();
