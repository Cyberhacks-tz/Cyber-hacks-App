const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "  initialData,\n  isAdmin?: any,\n  isAdmin?: boolean\n}) => {",
  "  initialData?: any,\n  isAdmin?: boolean\n}) => {"
);
fs.writeFileSync('src/App.tsx', content);
