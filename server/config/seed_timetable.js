const mysql = require('mysql2/promise');

const pool = require('./db');


const periods = [
  { slot: 'Period 1', start: '09:15:00', end: '10:05:00' },
  { slot: 'Period 2', start: '10:05:00', end: '10:55:00' },
  { slot: 'Period 3', start: '11:10:00', end: '12:00:00' },
  { slot: 'Period 4', start: '12:00:00', end: '12:50:00' },
  { slot: 'Period 5', start: '13:35:00', end: '14:20:00' },
  { slot: 'Period 6', start: '14:20:00', end: '15:05:00' },
  { slot: 'Period 7', start: '15:15:00', end: '16:00:00' },
  { slot: 'Period 8', start: '16:00:00', end: '16:45:00' }
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const years = [1, 2, 3, 4];
const departments = ['CSE', 'IT', 'ECE', 'EEE', 'AIDS', 'AIML', 'MECH', 'MBA'];

const annaUnivSubjects = {
  CSE: {
    1: ['HS3151 Professional English', 'MA3151 Matrices and Calculus', 'PH3151 Engineering Physics', 'CY3151 Engineering Chemistry', 'GE3151 Problem Solving and Python Programming', 'GE3152 Heritage of Tamils'],
    2: ['CS3351 Digital Principles and Computer Organization', 'CS3352 Foundations of Data Science', 'CS3391 Object Oriented Programming', 'CS3301 Data Structures', 'MA3354 Discrete Mathematics'],
    3: ['CS3591 Computer Networks', 'CS3501 Compiler Design', 'CB3491 Cryptography and Cyber Security', 'CS3551 Distributed Computing', 'CS3691 Embedded Systems and IoT'],
    4: ['CS3791 Human Computer Interaction', 'GE3791 Human Values and Ethics', 'CS3711 Project Work / Internship', 'Professional Elective V', 'Professional Elective VI']
  },
  IT: {
    1: ['HS3151 Professional English', 'MA3151 Matrices and Calculus', 'PH3151 Engineering Physics', 'CY3151 Engineering Chemistry', 'GE3151 Problem Solving and Python Programming'],
    2: ['IT3350 Databases and Design', 'IT3351 Web Technologies', 'CS3391 Object Oriented Programming', 'CS3301 Data Structures'],
    3: ['IT3501 Full Stack Web Development', 'CS3591 Computer Networks', 'IT3511 Mobile Web Application Development', 'CS3691 Embedded Systems and IoT'],
    4: ['IT3751 Machine Learning and Deep Learning', 'GE3791 Human Values and Ethics', 'Project Work / Internship']
  },
  ECE: {
    1: ['HS3151 Professional English', 'MA3151 Matrices and Calculus', 'PH3151 Engineering Physics', 'CY3151 Engineering Chemistry', 'GE3151 Problem Solving and Python Programming'],
    2: ['EC3354 Signals and Systems', 'EC3353 Electronic Devices and Circuits', 'EC3351 Control Systems', 'EC3352 Digital Systems Design'],
    3: ['EC3501 Wireless Communication', 'EC3552 VLSI and Chip Design', 'EC3551 Transmission Lines and RF Systems', 'EC3561 Microprocessors and Microcontrollers'],
    4: ['EC3751 Optical Communication', 'GE3791 Human Values and Ethics', 'Project Work / Internship']
  },
  EEE: {
    1: ['HS3151 Professional English', 'MA3151 Matrices and Calculus', 'PH3151 Engineering Physics', 'CY3151 Engineering Chemistry'],
    2: ['EE3301 Electromagnetic Fields', 'EE3302 Digital Logic Circuits', 'EE3303 Electrical Machines - I'],
    3: ['EE3501 Power System Analysis', 'EE3591 Power Electronics', 'EE3503 Control Systems', 'EE3504 Renewable Energy Systems'],
    4: ['EE3701 High Voltage Engineering', 'EE3702 Electric Vehicle Mechanics', 'Project Work']
  },
  MECH: {
    1: ['HS3151 Professional English', 'MA3151 Matrices and Calculus', 'PH3151 Engineering Physics', 'CY3151 Engineering Chemistry'],
    2: ['ME3351 Engineering Mechanics', 'ME3391 Engineering Thermodynamics', 'ME3392 Fluid Mechanics and Machinery', 'ME3393 Manufacturing Processes'],
    3: ['ME3591 Design of Machine Elements', 'ME3592 Metrology and Measurements', 'ME3593 Heat and Mass Transfer'],
    4: ['ME3791 Mechatronics', 'ME3792 Computer Integrated Manufacturing', 'Project Work']
  },
  MBA: {
    1: ['BA4101 Statistics for Management', 'BA4102 Management Concepts', 'BA4103 Managerial Economics', 'BA4104 Accounting for Decision Making'],
    2: ['BA4201 Quantitative Techniques', 'BA4202 Financial Management', 'BA4203 Human Resource Management', 'BA4204 Marketing Management'],
    3: ['BA4301 Strategic Management', 'BA4302 International Business Management', 'Elective I', 'Elective II'],
    4: ['BA4401 Business Ethics', 'Project Work', 'Elective III', 'Elective IV']
  },
  AIDS: {
    1: ['HS3151 Professional English', 'MA3151 Matrices and Calculus', 'PH3151 Engineering Physics', 'GE3151 Problem Solving and Python Programming'],
    2: ['AD3351 Design and Analysis of Algorithms', 'AD3391 Database Design and Management', 'AD3352 Introduction to Data Science', 'CS3391 Object Oriented Programming'],
    3: ['AD3501 Deep Learning', 'AD3502 Big Data Analytics', 'AD3503 Cloud Computing', 'AD3504 Distributed Computing'],
    4: ['AD3701 Natural Language Processing', 'AD3702 Machine Learning Techniques', 'Project Work']
  },
  AIML: {
    1: ['HS3151 Professional English', 'MA3151 Matrices and Calculus', 'PH3151 Engineering Physics', 'GE3151 Problem Solving and Python Programming'],
    2: ['AM3351 Machine Learning Fundamentals', 'AM3352 Probability and Statistics', 'CS3391 Object Oriented Programming', 'CS3301 Data Structures'],
    3: ['AM3501 Artificial Intelligence Principles', 'AM3502 Neural Networks', 'AM3503 Reinforcement Learning', 'AM3504 Data Analytics'],
    4: ['AM3701 AI in Healthcare', 'AM3702 Advanced Deep Learning', 'Project Work']
  }
};

const rooms = ['Block A - 101', 'Block A - 102', 'Block B - 204', 'Block B - 205', 'Block C - 301', 'Block C - 302', 'Smart Class - 1', 'Smart Class - 2', 'Lab 1', 'Lab 2', 'Lab 3'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  const connection = pool;
  try {
    console.log("Clearing existing timetable...");
    await connection.query("TRUNCATE TABLE timetable");

    console.log("Fetching faculty...");
    const [facultyRows] = await connection.query("SELECT id, name, department FROM faculty");
    const facultyByDept = {};
    facultyRows.forEach(f => {
      if (!facultyByDept[f.department]) facultyByDept[f.department] = [];
      facultyByDept[f.department].push(f);
    });

    console.log("Generating timetable...");
    const inserts = [];
    
    for (const dept of departments) {
      for (const year of years) {
        let subjects = annaUnivSubjects[dept]?.[year];
        if (!subjects || subjects.length === 0) {
           subjects = ['Generic Subject 1', 'Generic Subject 2']; // Fallback
        }

        const deptFaculty = facultyByDept[dept] || facultyRows;

        for (const day of days) {
          for (let pIndex = 0; pIndex < periods.length; pIndex++) {
            const period = periods[pIndex];
            
            let subject = getRandomItem(subjects);
            if (subject.includes("Project Work") || (pIndex >= 6 && Math.random() > 0.5)) {
                subject = "Lab / Practical / Project";
            }

            const faculty = getRandomItem(deptFaculty);
            const room = getRandomItem(rooms);

            inserts.push([
              dept, year, day, period.start, period.end, subject, String(faculty.id), room, period.slot, faculty.name
            ]);
          }
        }
      }
    }

    const batchSize = 500;
    for (let i = 0; i < inserts.length; i += batchSize) {
      const batch = inserts.slice(i, i + batchSize);
      await connection.query(
        "INSERT INTO timetable (department, year, day, start_time, end_time, subject, faculty, room, time_slot, faculty_name) VALUES ?",
        [batch]
      );
    }
    
    console.log(`Successfully inserted ${inserts.length} timetable records reflecting Anna University Reg 2021!`);

  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    process.exit(0);
  }
}

seed();
