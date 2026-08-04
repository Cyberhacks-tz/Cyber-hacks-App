const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `                  <div className="flex items-center gap-3">
                    {u.photoURL ? (
                      <img src={u.photoURL} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                        <UserIcon size={20} className="text-zinc-500" />
                      </div>
                    )}
                    <div>
                      <button onClick={() => setSelectedUserForAction(u)} className="font-bold text-sm text-left hover:text-purple-400 flex items-center gap-1 transition-colors">
                        {u.displayName}
                        {u.verified && <BadgeCheck size={14} className="text-blue-500" />}
                      </button>
                      <div className="text-[10px] text-zinc-500">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-[10px] font-mono text-zinc-600">{u.role}</div>
                    {u.banned && <div className="text-[10px] font-bold text-red-500">BANNED</div>}
                  </div>`;

// We replace the inside of the users map loop
const regex = /<div className="flex items-center gap-3">[\s\S]*?<div className="text-\[10px\] font-mono text-zinc-600">\{u\.role\}<\/div>\s*<\/div>/;
content = content.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', content);
