const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

async function run() {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  const [rows] = await c.query("SELECT id, name, email, role FROM users");
  console.log("Users:", rows);
  process.exit(0);
}
run();
