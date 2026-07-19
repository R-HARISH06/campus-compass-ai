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
  { name: 'Dr. T Ramesh', dept: 'AIDS', desig: 'Professor', qual: 'M.E., Ph.D', gender: 'Male' },
  { name: 'Ms. K Anitha', dept: 'AIDS', desig: 'Assistant Professor', qual: 'M.E.', gender: 'Female' },
  { name: 'Mr. S Suresh', dept: 'AIDS', desig: 'Assistant Professor', qual: 'M.Tech.', gender: 'Male' },
  { name: 'Dr. N Vimala', dept: 'AIDS', desig: 'Associate Professor', qual: 'M.E., Ph.D', gender: 'Female' },
  { name: 'Ms. R Priya', dept: 'AIDS', desig: 'Assistant Professor', qual: 'M.E.', gender: 'Female' },
  // AIML
  { name: 'Dr. M Kumar', dept: 'AIML', desig: 'Professor', qual: 'M.E., Ph.D', gender: 'Male' },
  { name: 'Ms. V Lakshmi', dept: 'AIML', desig: 'Assistant Professor', qual: 'M.E.', gender: 'Female' },
  { name: 'Mr. P Dinesh', dept: 'AIML', desig: 'Assistant Professor', qual: 'M.Tech.', gender: 'Male' },
  { name: 'Ms. A Divya', dept: 'AIML', desig: 'Assistant Professor', qual: 'M.E.', gender: 'Female' },
  { name: 'Mr. K Balaji', dept: 'AIML', desig: 'Assistant Professor', qual: 'M.E.', gender: 'Male' },
  // ECE
  { name: 'Ms. S Swathi', dept: 'ECE', desig: 'Assistant Professor', qual: 'M.E.', gender: 'Female' },
  { name: 'Mr. B Vignesh', dept: 'ECE', desig: 'Assistant Professor', qual: 'M.E.', gender: 'Male' },
  { name: 'Dr. R Meena', dept: 'ECE', desig: 'Associate Professor', qual: 'M.E., Ph.D', gender: 'Female' },
  { name: 'Mr. G Hari', dept: 'ECE', desig: 'Assistant Professor', qual: 'M.E.', gender: 'Male' },
  // EEE
  { name: 'Dr. P Senthil', dept: 'EEE', desig: 'Professor', qual: 'M.E., Ph.D', gender: 'Male' },
  { name: 'Ms. N Kavitha', dept: 'EEE', desig: 'Assistant Professor', qual: 'M.E.', gender: 'Female' },
  { name: 'Mr. D Rajesh', dept: 'EEE', desig: 'Assistant Professor', qual: 'M.E.', gender: 'Male' },
  { name: 'Ms. K Revathi', dept: 'EEE', desig: 'Assistant Professor', qual: 'M.E.', gender: 'Female' },
  // MECH
  { name: 'Mr. A Murugan', dept: 'MECH', desig: 'Assistant Professor', qual: 'M.E.', gender: 'Male' },
  { name: 'Dr. T Prakash', dept: 'MECH', desig: 'Associate Professor', qual: 'M.E., Ph.D', gender: 'Male' },
  { name: 'Mr. S Karthi', dept: 'MECH', desig: 'Assistant Professor', qual: 'M.E.', gender: 'Male' },
  { name: 'Mr. R Venkatesh', dept: 'MECH', desig: 'Assistant Professor', qual: 'M.E.', gender: 'Male' },
  // MBA
  { name: 'Dr. S Geetha', dept: 'MBA', desig: 'Professor', qual: 'MBA, Ph.D', gender: 'Female' },
  { name: 'Mr. K Ashok', dept: 'MBA', desig: 'Assistant Professor', qual: 'MBA', gender: 'Male' },
  { name: 'Ms. P Nandhini', dept: 'MBA', desig: 'Assistant Professor', qual: 'MBA', gender: 'Female' },
  { name: 'Ms. V Sandhya', dept: 'MBA', desig: 'Assistant Professor', qual: 'MBA', gender: 'Female' },
];

function inferGender(name) {
  const n = name.toLowerCase();
  if (n.startsWith('mr.')) return 'Male';
  if (n.startsWith('ms.') || n.startsWith('mrs.')) return 'Female';
  
  const femaleNames = ['punitha', 'senthamil', 'mohana', 'rajalakshmi', 'rachel', 'maria', 'shapna', 'roshini', 'sathya', 'parkavi', 'mohanappriya', 'ramya', 'rohini', 'sugantha', 'nagalakshmi', 'kavitha', 'revathi', 'geetha', 'nandhini', 'sandhya', 'meena', 'swathi', 'vimala', 'priya', 'lakshmi', 'divya', 'anitha'];
  const maleNames = ['chandrasekaran', 'boobala', 'parthipan', 'karthik', 'kumar', 'ramesh', 'suresh', 'dinesh', 'balaji', 'vignesh', 'hari', 'senthil', 'rajesh', 'murugan', 'prakash', 'karthi', 'venkatesh', 'ashok'];

  for (let fn of femaleNames) {
    if (n.includes(fn)) return 'Female';
  }
  for (let mn of maleNames) {
    if (n.includes(mn)) return 'Male';
  }
  
  return 'Male'; // default
}

async function run() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    try {
      await connection.query("ALTER TABLE faculty ADD COLUMN gender VARCHAR(10) DEFAULT 'Male'");
      console.log("Added gender column.");
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') throw e;
    }

    for (const f of additionalFaculty) {
      const [existing] = await connection.query("SELECT id FROM faculty WHERE name = ? AND department = ?", [f.name, f.dept]);
      if (existing.length === 0) {
        await connection.query(
          "INSERT INTO faculty (name, department, designation, qualification, gender, email) VALUES (?, ?, ?, ?, ?, ?)",
          [f.name, f.dept, f.desig, f.qual, f.gender, f.name.replace(/[^a-zA-Z]/g, '').toLowerCase() + '@saranathan.ac.in']
        );
      }
    }
    console.log("Added new faculty members.");

    const [allFaculty] = await connection.query("SELECT id, name FROM faculty");
    for (const f of allFaculty) {
      const g = inferGender(f.name);
      await connection.query("UPDATE faculty SET gender = ? WHERE id = ?", [g, f.id]);
    }
    console.log("Updated genders for all faculty.");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await connection.end();
  }

  console.log("Running detailed seeder to populate missing education/projects for new faculty...");
  execSync('node config/seed_detailed_faculty.js', { stdio: 'inherit' });
}

run();
