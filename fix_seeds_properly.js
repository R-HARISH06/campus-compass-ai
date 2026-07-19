const fs = require('fs');
const files = ['server/config/seed_timetable.js', 'server/config/seed_detailed_faculty.js', 'server/config/seed_cafe.js'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove the bad process.exit(0) at the end of the file
    content = content.replace(/\n\nprocess\.exit\(0\);\n?/g, '');
    
    // Replace the commented out connection.end with process.exit(0) inside the finally block
    content = content.replace(/\/\* await connection\.end\(\); \*\//g, "process.exit(0);");
    
    fs.writeFileSync(file, content);
    console.log("Fixed exit logic in", file);
  }
});
