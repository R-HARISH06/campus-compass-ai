const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'client', 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/style=\{\{\s*paddingTop:\s*'120px'\s*\}\}/g, '');
  content = content.replace(/position-relative/g, 'position-relative page-wrapper');
  
  fs.writeFileSync(filePath, content);
}

const dashboardPath = path.join(__dirname, 'client', 'src', 'components', 'Dashboard.jsx');
let dashContent = fs.readFileSync(dashboardPath, 'utf8');
dashContent = dashContent.replace(/style=\{\{\s*paddingTop:\s*'120px'\s*\}\}/g, '');
dashContent = dashContent.replace(/position-relative/g, 'position-relative page-wrapper');
fs.writeFileSync(dashboardPath, dashContent);

const cssPath = path.join(__dirname, 'client', 'src', 'index.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');
cssContent += '\n\n/* Global Page Wrapper Padding */\n.page-wrapper {\n  padding-top: 120px !important;\n}\n@media (max-width: 991px) {\n  .page-wrapper {\n    padding-top: 150px !important;\n  }\n}\n';
fs.writeFileSync(cssPath, cssContent);
console.log('Migrated to CSS class page-wrapper');
