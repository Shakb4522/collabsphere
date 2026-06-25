const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('http://localhost:5000')) {
    // Add API_URL definition after imports if not exists
    if (!content.includes('const API_URL')) {
      const importLastIndex = content.lastIndexOf('import ');
      const importEndIndex = content.indexOf('\n', importLastIndex) + 1;
      content = content.slice(0, importEndIndex) + '\nconst API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";\n' + content.slice(importEndIndex);
    }
    
    // Replace string literals 'http://localhost:5000/api/...' -> `${API_URL}/api/...`
    content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${API_URL}$1`');
    
    // Replace template strings `http://localhost:5000/api/...` -> `${API_URL}/api/...`
    content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${API_URL}$1`');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

const files = [
  'src/pages/Login.tsx',
  'src/pages/Workspaces.tsx',
  'src/pages/WorkspaceDetails.tsx',
  'src/pages/Chat.tsx',
  'src/pages/Meeting.tsx'
];

files.forEach(f => replaceInFile(path.join(__dirname, f)));
