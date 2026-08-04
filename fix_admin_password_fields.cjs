const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `<div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">{t('passwordOptional')}</label>`;

const parts = content.split(target1);
if (parts.length > 1) {
  let newContent = parts[0];
  for (let i = 1; i < parts.length; i++) {
    let part = parts[i];
    // Find the end of the passwordRequestMsg block
    const endStr = `placeholder="『App』password from app"
                />
              </div>`;
    const endIndex = part.indexOf(endStr);
    
    if (endIndex !== -1) {
      const rest = part.substring(endIndex + endStr.length);
      const inner = target1 + part.substring(0, endIndex + endStr.length);
      newContent += `{isAdmin && (\n<>\n` + inner + `\n</>\n)}\n` + rest;
    } else {
      newContent += target1 + part; // should not happen
    }
  }
  fs.writeFileSync('src/App.tsx', newContent);
  console.log("Wrapped password fields.");
}
