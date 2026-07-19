const mysql = require('mysql2/promise');
const { execSync } = require('child_process');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Harish@123',
  database: 'campus_compass_ai'
};

const additionalFaculty = [
  // AIDS
  { name: 'Dr. T Ramesh', dept: 'AIDS', desig: 'Professor', qual: 'M.E., Ph.D' },
  { name: 'Ms. K Anitha', dept: 'AIDS', desig: 'Assistant Professor', qual: 'M.E.' },
  { name: 'Mr. S Suresh', dept: 'AIDS', desig: 'Assistant Professor', qual: 'M.Tech.' },
  { name: 'Dr. N Vimala', dept: 'AIDS', desig: 'Associate Professor', qual: 'M.E., Ph.D' },
  { name: 'Ms. R Priya', dept: 'AIDS', desig: 'Assistant Professor', qual: 'M.E.' },
  // AIML
  { name: 'Dr. M Kumar', dept: 'AIML', desig: 'Professor', qual: 'M.E., Ph.D' },
  { name: 'Ms. V Lakshmi', dept: 'AIML', desig: 'Assistant Professor', qual: 'M.E.' },
  { name: 'Mr. P Dinesh', dept: 'AIML', desig: 'Assistant Professor', qual: 'M.Tech.' },
  { name: 'Ms. A Divya', dept: 'AIML', desig: 'Assistant Professor', qual: 'M.E.' },
  { name: 'Mr. K Balaji', dept: 'AIML', desig: 'Assistant Professor', qual: 'M.E.' },
  // ECE
  { name: 'Ms. S Swathi', dept: 'ECE', desig: 'Assistant Professor', qual: 'M.E.' },
  { name: 'Mr. B Vignesh', dept: 'ECE', desig: 'Assistant Professor', qual: 'M.E.' },
  { name: 'Dr. R Meena', dept: 'ECE', desig: 'Associate Professor', qual: 'M.E., Ph.D' },
  { name: 'Mr. G Hari', dept: 'ECE', desig: 'Assistant Professor', qual: 'M.E.' },
  // EEE
  { name: 'Dr. P Senthil', dept: 'EEE', desig: 'Professor', qual: 'M.E., Ph.D' },
  { name: 'Ms. N Kavitha', dept: 'EEE', desig: 'Assistant Professor', qual: 'M.E.' },
  { name: 'Mr. D Rajesh', dept: 'EEE', desig: 'Assistant Professor', qual: 'M.E.' },
  { name: 'Ms. K Revathi', dept: 'EEE', desig: 'Assistant Professor', qual: 'M.E.' },
  // MECH
  { name: 'Mr. A Murugan', dept: 'MECH', desig: 'Assistant Professor', qual: 'M.E.' },
  { name: 'Dr. T Prakash', dept: 'MECH', desig: 'Associate Professor', qual: 'M.E., Ph.D' },
  { name: 'Mr. S Karthi', dept: 'MECH', desig: 'Assistant Professor', qual: 'M.E.' },
  { name: 'Mr. R Venkatesh', dept: 'MECH', desig: 'Assistant Professor', qual: 'M.E.' },
  // MBA
  { name: 'Dr. S Geetha', dept: 'MBA', desig: 'Professor', qual: 'MBA, Ph.D' },
  { name: 'Mr. K Ashok', dept: 'MBA', desig: 'Assistant Professor', qual: 'MBA' },
  { name: 'Ms. P Nandhini', dept: 'MBA', desig: 'Assistant Professor', qual: 'MBA' },
  { name: 'Ms. V Sandhya', dept: 'MBA', desig: 'Assistant Professor', qual: 'MBA' },
];

async function run() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    for (const f of additionalFaculty) {
      const [existing] = await connection.query("SELECT id FROM faculty WHERE name = ? AND department = ?", [f.name, f.dept]);
      if (existing.length === 0) {
        await connection.query(
          "INSERT INTO faculty (name, department, designation, qualification, email) VALUES (?, ?, ?, ?, ?)",
          [f.name, f.dept, f.desig, f.qual, f.name.replace(/[^a-zA-Z]/g, '').toLowerCase() + '@saranathan.ac.in']
        );
      }
    }
    console.log("Added new faculty members successfully.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await connection.end();
  }

  console.log("Running detailed seeder to populate missing education/projects for new faculty...");
  execSync('node config/seed_detailed_faculty.js', { stdio: 'inherit' });
}

run();
