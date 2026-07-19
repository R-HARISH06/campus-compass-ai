const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Harish@123',
  database: 'campus_compass_ai'
};

const hodUpdates = [
  {
    dept: 'CSE',
    currentName: 'Dr. V Punitha',
    newName: 'Dr. V Punitha',
    education: 'M.E., Ph.D.\nRecognized as Bronze Partner Faculty by Infosys.',
    projects: '• Research on energy-aware routing in Wireless Sensor Networks (WSN)\n• Brain tumor prognosis using machine learning\n• Blockchain-based medical health record systems\n• Deep learning for traffic classification and DoS attack detection',
    expertise: 'Distributed Systems, Cloud Computing, Network Security, Artificial Intelligence'
  },
  {
    dept: 'IT',
    currentName: 'Dr. R Thillaikarasi',
    newName: 'Dr. V Punitha', // She is HOD for both CSE & IT based on search
    education: 'M.E., Ph.D.\nRecognized as Bronze Partner Faculty by Infosys.',
    projects: '• Research on energy-aware routing in Wireless Sensor Networks (WSN)\n• Brain tumor prognosis using machine learning\n• Blockchain-based medical health record systems',
    expertise: 'Distributed Systems, Cloud Computing, Network Security, Artificial Intelligence'
  },
  {
    dept: 'ECE',
    currentName: 'Dr. S Rajkumar',
    newName: 'Dr. M Santhi',
    education: 'M.E. VLSI Design, Ph.D.',
    projects: '• AICTE MODROBS Scheme (Rs. 12.0 Lakhs)\n• Patent: Wireless Device for Realtime Monitoring and Recording Biopotentials\n• Design of a Variable Temperature Device for Extending Storage Life of Tomatoes\n• Navigation with Indian Constellation',
    expertise: 'VLSI design, signal processing, asynchronous techniques, wireless communication'
  },
  {
    dept: 'EEE',
    currentName: 'Dr. T Mahalakshmi',
    newName: 'Dr. C Krishnakumar',
    education: 'B.E. at Bharathidasan University\nM.Tech. at SASTRA University\nPh.D. at Anna University',
    projects: '• Mitigation of Conducted Electromagnetic Interference (EMI) in DC-DC converters\n• High gain multi-input single-output DC-DC boost converter for photovoltaic applications\n• Power quality battery chargers',
    expertise: 'High Voltage Engineering, Power Electronics, Renewable Energy Integration'
  },
  {
    dept: 'AIDS',
    currentName: 'Dr. M Anitha',
    newName: 'Dr. S Ravimaran',
    education: 'M.E., Ph.D.\nChairman of The Institution of Engineers (India) - Tiruchirappalli',
    projects: '• IoT-based electronic white canes for the visually impaired\n• Power system optimization using machine learning and deep learning\n• Mobile cloud security and Data scattering',
    expertise: 'Cloud computing, Mobile cloud security, Artificial Intelligence'
  },
  {
    dept: 'AIML',
    currentName: 'Dr. R Vijayalakshmi',
    newName: 'Dr. A Delphin Carolina Rani',
    education: 'B.E. at GCT Coimbatore\nM.E. at Shanmuga Engineering College\nPh.D. at Bharathidasan University',
    projects: '• Font and Tamil letter recognition using Deep Learning\n• Metaheuristic optimization algorithms (e.g., discrete firefly algorithm)\n• Combinatorial Optimization and Multiprocessor Scheduling',
    expertise: 'Machine Learning, Deep Learning, Soft Computing Techniques'
  },
  {
    dept: 'MECH',
    currentName: 'Dr. V Murugan',
    newName: 'Dr. G Jayaprakash',
    education: 'Ph.D. (2013)',
    projects: '• Drilling characteristics of Duplex stainless steels and magnesium alloys\n• Biomass gasification (circulating fluidized bed gasifiers)\n• Optimal tolerance design for mechanical assemblies using finite element simulation',
    expertise: 'CAD/FEA, Manufacturing Engineering, Evolutionary Algorithms'
  },
  {
    dept: 'MBA',
    currentName: 'Dr. A Jayanthi',
    newName: 'Dr. K Karthikeyan',
    education: 'B.Com & MBA at Bishop Heber College\nPost Graduate Diploma in HRM at Pondicherry University\nPh.D. at Bharathidasan University',
    projects: '• Coordinator of the Entrepreneurship Development Cell (EDC)\n• Anchor of talk shows on entrepreneurship (e.g., "Mudivedu Munneru")\n• Industry-linked learning and department newsletters',
    expertise: 'Entrepreneurship Development, Management Studies, HR and Marketing'
  }
];

async function updateHODs() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    for (const hod of hodUpdates) {
      // Find the placeholder HOD (is_hod = 1 for the specific department)
      const [rows] = await connection.query("SELECT id FROM faculty WHERE department = ? AND is_hod = 1", [hod.dept]);
      
      if (rows.length > 0) {
        const hodId = rows[0].id;
        const email = hod.newName.replace(/[^a-zA-Z]/g, '').toLowerCase() + '@saranathan.ac.in';
        
        await connection.query(
          "UPDATE faculty SET name = ?, email = ?, education_history = ?, projects = ?, area_of_expertise = ? WHERE id = ?",
          [hod.newName, email, hod.education, hod.projects, hod.expertise, hodId]
        );
        console.log(`Successfully updated real HOD data for ${hod.dept} -> ${hod.newName}`);
      } else {
        console.log(`Could not find HOD entry for department ${hod.dept}`);
      }
    }
  } catch (error) {
    console.error("Error updating HODs:", error);
  } finally {
    await connection.end();
  }
}

updateHODs();
