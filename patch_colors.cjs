const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace backgrounds back to how they were
content = content.replace(/bg-black text-zinc-400 hover:bg-zinc-900 hover:text-red-500/g, 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-red-500');

// But make sure the heart icon itself is black when unliked, red when liked
content = content.replace(/className=\{\(userReaction === "like"\) \? "fill-red-500 text-red-500" : "fill-black text-black"\}/g, 'className={(userReaction === "like") ? "fill-red-500 text-red-500" : "fill-transparent text-zinc-800 dark:text-zinc-300"}');

fs.writeFileSync('src/App.tsx', content);
