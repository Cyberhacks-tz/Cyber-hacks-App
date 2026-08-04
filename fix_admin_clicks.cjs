const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "const AdminDashboard = ({ t, theme }: { t: (k: string) => string, theme: string }) => {",
  "const AdminDashboard = ({ t, theme, onUserClick }: { t: (k: string) => string, theme: string, onUserClick: (u: UserProfile) => void }) => {"
);

const usersMapStr = `            {usersList.map(u => (
              <div key={u.uid} className={cn("flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0", theme === 'dark' ? "border-zinc-800" : "border-zinc-100")}>
                 <img src={u.photoURL} className="w-10 h-10 rounded-full" alt="Profile" />
                 <div className="flex-1">
                   <button onClick={() => onUserClick(u)} className={cn("text-sm font-medium hover:text-purple-400 text-left flex items-center gap-1 transition-colors", theme === 'dark' ? "text-white" : "text-zinc-100")}>
                     {u.displayName}
                     {u.verified && <BadgeCheck size={14} className="text-blue-500" />}
                   </button>
                   <p className="text-zinc-500 text-xs">{u.email}</p>
                 </div>
                 <div className="text-right flex flex-col items-end gap-1">
                    <span className={cn("text-[10px] px-2 py-1 rounded-full uppercase font-bold", u.role === 'admin' ? "bg-red-500/10 text-red-500" : "bg-gradient-to-r from-green-600 to-purple-600/10 text-green-400")}>
                      {u.role}
                    </span>
                    {u.banned && <span className="text-[10px] font-bold text-red-500">BANNED</span>}
                 </div>
              </div>
            ))}`;

content = content.replace(/\{usersList\.map\(u => \([\s\S]*?<\/div>\n            \)\)\}/, usersMapStr);

content = content.replace(
  "<AdminDashboard t={t} theme={theme} />",
  "<AdminDashboard t={t} theme={theme} onUserClick={setSelectedUserForAction} />"
);

fs.writeFileSync('src/App.tsx', content);
