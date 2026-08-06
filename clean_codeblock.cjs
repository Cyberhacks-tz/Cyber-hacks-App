const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /<SyntaxHighlighter[\s\S]*?<\/SyntaxHighlighter>\s*(<AnimatePresence>[\s\S]*?<\/AnimatePresence>\s*<AnimatePresence>[\s\S]*?<\/AnimatePresence>)/g;

content = content.replace(regex, (match, p1) => {
  return match.replace(p1, '');
});

fs.writeFileSync('src/App.tsx', content);
