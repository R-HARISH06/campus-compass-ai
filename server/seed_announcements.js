const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

async function seed() {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  await c.query(`
    INSERT INTO announcements (title, body, created_by) VALUES
    ('Semester Exam Schedule Released', 'The final semester exam schedule for 3rd and 4th year students has been uploaded to the university portal. Please check your respective department boards for more info.', 1),
    ('Canteen Closed on Friday', 'Due to scheduled maintenance in the main block kitchen, the campus canteen will remain closed this Friday. Please make alternate arrangements.', 1),
    ('Hackathon 2026 Registrations Open', 'Registrations for the annual 48-hour coding hackathon are now open! Exciting prizes to be won. Form your teams and register on the Events page!', 1)
  `);

  console.log("Announcements seeded!");
  process.exit(0);
}
seed();
