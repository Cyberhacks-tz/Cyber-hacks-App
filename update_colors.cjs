const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// I will make some primary buttons use purple gradient
content = content.replace(/bg-purple-600/g, 'bg-gradient-to-r from-green-600 to-purple-600');
content = content.replace(/hover:bg-purple-500/g, 'hover:from-green-500 hover:to-purple-500');

// "CYBER HACKS" text
content = content.replace(/text-green-400">CYBER/g, 'text-white">CYBER');
content = content.replace(/text-white">CYBER HACKS/g, 'text-white">CYBER HACKS'); // maybe not

fs.writeFileSync('src/App.tsx', content);
console.log("Updated to green-purple gradients.");
