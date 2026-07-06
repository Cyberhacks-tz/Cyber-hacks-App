const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/CYBER HACKS v2/g, 'CYBER HACKS'); // reset just in case
content = content.replace(/CYBER HACKS/g, 'CYBER HACKS v2');
content = content.replace(/Cyber Hacks/g, 'Cyber Hacks v2');
// Also Visor2 mentioned by user as a new version
content = content.replace(/CYBER HACKS v2 v2/g, 'CYBER HACKS v2');

fs.writeFileSync('src/App.tsx', content);
console.log("Updated title to v2");
