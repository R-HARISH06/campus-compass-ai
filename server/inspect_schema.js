const db = require("./config/db");

const inspect = async () => {
  try {
    const tables = ["faculty", "timetable", "announcements"];
    for (const table of tables) {
      try {
        const [columns] = await db.query(`DESCRIBE ${table}`);
        console.log(`\n--- SCHEMA FOR TABLE: ${table} ---`);
        columns.forEach(col => {
          console.log(`${col.Field} | ${col.Type} | Null: ${col.Null} | Key: ${col.Key} | Default: ${col.Default}`);
        });
      } catch (err) {
        console.log(`Table '${table}' not found or error:`, err.message);
      }
    }
  } catch (error) {
    console.error("Connection error:", error.message);
  } finally {
    process.exit(0);
  }
};

inspect();
