const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldSpan = /<span className=\{cn\("text-\[10px\] px-2 py-1 rounded-full uppercase font-bold", u\.role === 'admin' \? "bg-red-500\/10 text-red-500" : "bg-gradient-to-r from-green-600 to-purple-600\/10 text-green-400"\)\}>\s*\{u\.role\}\s*<\/span>/;
const newBtn = `<button onClick={() => onUserClick(u)} className={cn("text-[10px] px-2 py-1 rounded-full uppercase font-bold hover:scale-105 active:scale-95 transition-transform", u.role === 'admin' ? "bg-red-500/10 text-red-500" : "bg-green-600/20 text-green-500")}>
                      {u.role}
                    </button>`;

content = content.replace(oldSpan, newBtn);
fs.writeFileSync('src/App.tsx', content);
