const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'client', 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/className=(["'])(.*?)(?:mt-5\s*pt-5|pt-5\s*mt-5|mt-5\s*pt-4)(.*?)\1/g, (match, quote, p1, p2) => {
    const newClass = (p1 + " " + p2).replace(/\s+/g, ' ').trim();
    return `className="${newClass} position-relative" style={{ paddingTop: '120px' }}`;
  });

  fs.writeFileSync(filePath, content);
}
console.log('Padding fixes applied');
