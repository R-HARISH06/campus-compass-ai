const db = require('./config/db');
(async () => {
  try {
    const [rows] = await db.query('SHOW TABLES');
    console.log('Tables:', rows);
  } catch (err) {
    console.error('DB error:', err);
  }
})();
