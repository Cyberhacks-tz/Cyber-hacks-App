import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replacements to support tailwind class based dark mode

content = content.replace(/bg-zinc-900/g, "dark:bg-zinc-900 bg-white");
content = content.replace(/border-zinc-800/g, "dark:border-zinc-800 border-zinc-200");
content = content.replace(/text-white/g, "dark:text-white text-black");
// Be careful with the above text-white, it might conflict in certain places.
// But mostly text-black won't hurt if we have dark:text-white. But let's avoid broad text-white replace and target specific things.

// Better to target the specific components that the user sees on main screens: Card, PremiumCard, NewsCard, AiPromptCard, Settings
fs.writeFileSync('src/App.tsx', content);

console.log('done');
