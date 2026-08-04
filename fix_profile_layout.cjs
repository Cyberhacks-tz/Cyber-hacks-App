const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Hide header on profile tab
const headerRegex = /<header className="sticky top-0 z-40 bg-inherit\/80 backdrop-blur-md px-6 py-4 flex justify-between items-center max-w-md mx-auto">([\s\S]*?)<\/header>/;
const headerMatch = content.match(headerRegex);
if (headerMatch && !content.includes("{activeTab !== 'profile' && (")) {
  content = content.replace(headerMatch[0], `{activeTab !== 'profile' && (\n      ${headerMatch[0]}\n      )}`);
  console.log("Hid main header on profile tab.");
}

// 2. Fix Profile Tab layout
const profileLayoutRegex = /<div className="flex justify-between items-center mb-6">([\s\S]*?)<div className="mt-8">/;
const newProfileLayout = `<div className="flex justify-between items-center mb-6">
                <div className="w-10"></div>
                <div className="font-bold text-lg">{profile?.displayName || 'Profile'}</div>
                <button onClick={() => setActiveTab('settings')} className="p-2 -mr-2 rounded-full hover:bg-zinc-800/50 transition-colors">
                   <Settings size={24} className="text-zinc-100" />
                </button>
              </div>
              
              <div className="flex items-center justify-between px-2">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserIcon size={40} className="text-zinc-600" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-green-600 to-purple-600 rounded-full border-[3px] border-black hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                    <Pencil size={14} className="text-white" />
                  </label>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <span className="font-black text-xl text-zinc-100">{filteredPosts.length}</span>
                    <span className="text-xs text-zinc-500 font-medium">Posts</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-black text-xl text-zinc-100">0</span>
                    <span className="text-xs text-zinc-500 font-medium">Followers</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-black text-xl text-zinc-100">0</span>
                    <span className="text-xs text-zinc-500 font-medium">Likes</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">`;

const profileMatch = content.match(profileLayoutRegex);
if (profileMatch) {
  content = content.replace(profileMatch[0], newProfileLayout);
  console.log("Updated profile tab layout.");
}

fs.writeFileSync('src/App.tsx', content);
