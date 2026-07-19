const fs = require('fs');
const files = ['server/config/seed_timetable.js', 'server/config/seed_detailed_faculty.js', 'server/config/seed_cafe.js'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Ensure the pool closes by explicitly exiting the process
    fs.writeFileSync(file, content + '\n\nprocess.exit(0);\n');
    console.log("Appended exit to", file);
  }
});
