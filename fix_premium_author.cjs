const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const premiumCardRegex = /<h3 className="font-bold text-zinc-100 truncate">([\s\S]*?)<\/div>\s*<div className="flex flex-col gap-2">/g;

// I'll do this carefully.
