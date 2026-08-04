const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /(<div className="space-y-1">\s*<label className="text-\[10px\] font-black text-zinc-500 uppercase tracking-widest px-2">{t\('passwordOptional'\)}<\/label>[\s\S]*?placeholder="『App』password from app"\s*\/>\s*<\/div>)/g;

let count = 0;
content = content.replace(regex, (match) => {
  count++;
  // fix the broken div from my previous script (if any)
  let fixedMatch = match.replace(/<\/div><\/div>\s*<div className="space-y-1">/, '</div>\n              </div>\n              <div className="space-y-1">');
  return `{isAdmin && (\n                <>\n                  ${fixedMatch}\n                </>\n              )}`;
});

fs.writeFileSync('src/App.tsx', content);
console.log("Wrapped " + count + " instances.");
