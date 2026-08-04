const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace("initialData,\n  isAdmin={editingItem}", "initialData={editingItem}");

fs.writeFileSync('src/App.tsx', content);
