const fs = require('fs');
const files = ['server/config/seed_timetable.js', 'server/config/seed_detailed_faculty.js', 'server/config/seed_cafe.js'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace mysql2/promise connection creation with db pool
    content = content.replace(/const dbConfig = \{[\s\S]*?\};/g, "const pool = require('./db');\n");
    content = content.replace(/const connection = await mysql\.createConnection\(dbConfig\);/g, "const connection = pool;");
    content = content.replace(/await connection\.end\(\);/g, "/* await connection.end(); */");
    
    fs.writeFileSync(file, content);
    console.log("Updated", file);
  }
});
