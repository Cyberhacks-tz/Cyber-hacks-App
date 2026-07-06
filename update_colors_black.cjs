const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Force black background
content = content.replace(/bg-zinc-950/g, 'bg-black');
content = content.replace(/bg-zinc-50/g, 'bg-black');
content = content.replace(/text-zinc-900/g, 'text-zinc-100');
content = content.replace(/text-black/g, 'text-zinc-100'); // some black texts are an issue on bg-black

fs.writeFileSync('src/App.tsx', content);
console.log("Updated to strictly black backgrounds.");
