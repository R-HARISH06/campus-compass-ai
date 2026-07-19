const mysql = require('mysql2/promise');

const pool = require('./db');


const domains = {
  CSE: ['Machine Learning', 'Data Mining', 'Artificial Intelligence', 'Cloud Computing', 'Computer Networks', 'Software Engineering'],
  IT: ['Cyber Security', 'Internet of Things', 'Blockchain', 'Big Data Analytics', 'Web Development'],
  ECE: ['VLSI Design', 'Embedded Systems', 'Signal Processing', 'Wireless Communication', 'Optical Networks'],
  EEE: ['Power Systems', 'Renewable Energy', 'Control Systems', 'Power Electronics', 'Electrical Drives'],
  MECH: ['Thermal Engineering', 'Manufacturing Technology', 'Robotics', 'Fluid Mechanics', 'Automobile Engineering'],
  MBA: ['Financial Management', 'Human Resource Management', 'Marketing Strategy', 'Operations Management'],
  AIDS: ['Deep Learning', 'Natural Language Processing', 'Data Science', 'Computer Vision'],
  AIML: ['Machine Learning Algorithms', 'AI Ethics', 'Reinforcement Learning', 'Neural Networks']
};

const projectsTemplates = [
  "Developed a novel approach for %DOMAIN% using advanced optimization techniques.",
  "Principal Investigator for a government-funded project on %DOMAIN%.",
  "Led a research team focusing on scalable solutions for %DOMAIN%.",
  "Published 5+ high-impact research papers in the field of %DOMAIN%.",
  "Collaborated with industry partners to implement %DOMAIN% in real-world scenarios.",
  "Designed an innovative framework for real-time applications in %DOMAIN%."
];

function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateEducation(qualification) {
  let ed = "B.E. at Anna University\n";
  if (qualification.includes("M.E") || qualification.includes("M.Tech")) {
    ed += "M.E./M.Tech at NIT Trichy\n";
  }
  if (qualification.includes("Ph.D")) {
    ed += "Ph.D. at Anna University, Chennai";
  }
  return ed.trim();
}

function generateExperience(designation) {
  if (designation.includes("Professor & Head")) return "20+ Years in Teaching and Research";
  if (designation.includes("Professor")) return "15+ Years in Academia";
  if (designation.includes("Associate")) return "10+ Years in Teaching";
  return "5+ Years in Teaching";
}

async function seed() {
  const connection = pool;
  try {
    console.log("Fetching faculty...");
    const [facultyList] = await connection.query("SELECT id, department, qualification, designation FROM faculty");
    
    console.log(`Generating detailed data for ${facultyList.length} faculty members...`);
    
    for (const f of facultyList) {
      const deptDomains = domains[f.department] || domains.CSE;
      const expertise = getRandomItems(deptDomains, 2).join(", ");
      
      const education = generateEducation(f.qualification || "M.E.");
      const experience = generateExperience(f.designation || "Assistant Professor");
      
      const projectDomain = getRandomItems(deptDomains, 1)[0];
      const projectTemplate = getRandomItems(projectsTemplates, 2);
      const projects = projectTemplate.map(p => p.replace("%DOMAIN%", projectDomain)).join("\n\n");
      
      await connection.query(
        "UPDATE faculty SET education_history = ?, projects = ?, area_of_expertise = ?, experience = ? WHERE id = ?",
        [education, projects, expertise, experience, f.id]
      );
    }
    
    console.log("Successfully updated all faculty members with detailed profiles!");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
