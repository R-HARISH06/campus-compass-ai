const fs = require('fs');
const content = fs.readFileSync('server/config/schema.sql', 'utf8');
const lines = content.split('\n');
const cleanLines = lines.filter(line => {
  const trimmed = line.trim();
  return !trimmed.startsWith('SET @') && 
         !trimmed.startsWith('PREPARE ') && 
         !trimmed.startsWith('CREATE DATABASE') && 
         !trimmed.startsWith('USE ');
});
fs.writeFileSync('server/config/railway_schema.sql', cleanLines.join('\n'));
console.log('Done cleaning SQL for Railway!');
