const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// We have things like layoutId="...", whileHover={{...}}, layout
content = content.replace(/\s*layoutId="[^"]*"/g, '');
content = content.replace(/\s*whileHover={{[^}]+}}/g, '');
content = content.replace(/\s*layout(?=[\s>])/g, '');

fs.writeFileSync('src/App.tsx', content);
