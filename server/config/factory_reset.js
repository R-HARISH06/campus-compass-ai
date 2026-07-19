const pool = require('./db');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function factoryReset() {
  try {
    console.log("Starting Factory Reset...");
    
    // 1. Wipe the tables that have duplicates or wrong data
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE events');
    await pool.query('TRUNCATE TABLE clubs');
    await pool.query('TRUNCATE TABLE canteen_menu');
    await pool.query('TRUNCATE TABLE timetable');
    await pool.query('TRUNCATE TABLE faculty');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log("Tables truncated.");

    // 2. Run railway_schema.sql to re-seed events and clubs
    let schemaSql = fs.readFileSync(path.join(__dirname, 'railway_schema.sql'), 'utf8');
    schemaSql = schemaSql.split('\n').filter(line => !line.trim().startsWith('--')).join('\n');
    const schemaQueries = schemaSql.split(';').map(q => q.trim()).filter(Boolean);
    for(let q of schemaQueries) {
      await pool.query(q);
    }
    console.log("Base schema and events/clubs seeded.");

    // 3. railway_schema.sql inserts BAD faculty and BAD timetable. We wipe them again!
    await pool.query('TRUNCATE TABLE timetable');
    await pool.query('TRUNCATE TABLE faculty');
    
    // 4. Run seed_faculty.sql
    let facultySql = fs.readFileSync(path.join(__dirname, 'seed_faculty.sql'), 'utf8');
    facultySql = facultySql.split('\n').filter(line => !line.trim().startsWith('--')).join('\n');
    const facultyQueries = facultySql.split(';').map(q => q.trim()).filter(Boolean);
    for(let q of facultyQueries) {
      await pool.query(q);
    }
    console.log("Detailed faculty SQL seeded.");

    // 5. Run the Detailed Faculty JS update script
    console.log("Running seed_detailed_faculty.js...");
    execSync('node seed_detailed_faculty.js', { cwd: __dirname });

    // 6. Run the Detailed Timetable JS script
    console.log("Running seed_timetable.js...");
    execSync('node seed_timetable.js', { cwd: __dirname });

    // 7. Run the Canteen JS script
    console.log("Running seed_cafe.js...");
    execSync('node seed_cafe.js', { cwd: __dirname });

    console.log("Factory Reset Complete!");
    process.exit(0);
  } catch (err) {
    console.error("Factory Reset Failed:", err);
    process.exit(1);
  }
}

factoryReset();
