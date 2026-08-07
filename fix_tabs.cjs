const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Restore the useState type
content = content.replace(/useState<'hacks' \| 'apps' \| 'news' \| 'aiprompts' \| 'followers' \| 'following'>/, "useState<'hacks' | 'apps' | 'news' | 'aiprompts'>");

// Restore the stat clicks
const targetStatClicks = `                        <div className="flex flex-col items-center cursor-pointer hover:opacity-80" onClick={() => setProfileTab('followers')}>
                          <span className="font-black text-xl text-zinc-100">{Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(followersCount)}</span>
                          <span className="text-xs text-zinc-500 font-medium">Followers</span>
                        </div>`;
const replaceStatClicks = `                        <div className="flex flex-col items-center cursor-pointer hover:opacity-80" onClick={() => {
                          setNetworkModalTab('followers');
                          setNetworkModalOpen(true);
                        }}>
                          <span className="font-black text-xl text-zinc-100">{Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(followersCount)}</span>
                          <span className="text-xs text-zinc-500 font-medium">Followers</span>
                        </div>`;
content = content.replace(targetStatClicks, replaceStatClicks);

// Remove the followers and following buttons
const followersBtn = `                         <button onClick={() => setProfileTab('followers')} className={cn("flex-1 whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest", profileTab === 'followers' ? "text-zinc-100 border-b-2 border-zinc-100" : "text-zinc-500 hover:text-zinc-300")}>
                           Followers
                         </button>`;
content = content.replace(followersBtn, '');

const followingBtn = `                         <button onClick={() => setProfileTab('following')} className={cn("flex-1 whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest", profileTab === 'following' ? "text-zinc-100 border-b-2 border-zinc-100" : "text-zinc-500 hover:text-zinc-300")}>
                           Following
                         </button>`;
content = content.replace(followingBtn, '');

fs.writeFileSync('src/App.tsx', content);
