const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace photoURL assignments
content = content.replace(/photoURL:\s*u\.photoURL\s*\|\|\s*`https:\/\/picsum\.photos\/seed\/\$\{u\.uid\}\/200`/g, 'photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`');

fs.writeFileSync('src/App.tsx', content);
