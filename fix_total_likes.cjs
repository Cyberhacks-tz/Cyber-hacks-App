const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/return acc \+ \(item\.reactions\?\.laugh \|\| 0\) \+ \(item\.reactions\?\.think \|\| 0\) \+ \(item\.reactions\?\.angry \|\| 0\) \+ fakeLikes;/, 
`return acc + (item.reactions?.like || 0) + fakeLikes;`);

fs.writeFileSync('src/App.tsx', code);
