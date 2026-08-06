const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(/u => u.displayName.toLowerCase\(\).includes/g, 'u => (u.displayName || "").toLowerCase().includes');

content = content.replace(/const hashA = a.uid.charCodeAt\(0\) \+ seed;/g, 'const hashA = (a.uid || "a").charCodeAt(0) + seed;');
content = content.replace(/const hashB = b.uid.charCodeAt\(0\) \+ seed;/g, 'const hashB = (b.uid || "b").charCodeAt(0) + seed;');

fs.writeFileSync('src/App.tsx', content);
