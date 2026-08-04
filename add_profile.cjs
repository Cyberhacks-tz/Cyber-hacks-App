const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const profileTabCode = `          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 pb-24"
            >
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => setActiveTab('settings')} className="p-2 -ml-2 rounded-full hover:bg-zinc-800/50 transition-colors">
                   <Settings size={24} className="text-zinc-100" />
                </button>
                <div className="font-bold text-lg">{profile?.displayName || 'Profile'}</div>
                <div className="w-10"></div>
              </div>
              
              <div className="flex items-center justify-between px-2">
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <span className="font-black text-xl text-zinc-100">0</span>
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
                  <button className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-green-600 to-purple-600 rounded-full border-[3px] border-black hover:scale-105 active:scale-95 transition-transform">
                    <Pencil size={14} className="text-white" />
                  </button>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex border-b border-zinc-800 w-full">
                   <button className="flex-1 py-3 text-sm font-bold uppercase tracking-widest text-zinc-100 border-b-2 border-zinc-100">
                     Posts
                   </button>
                </div>
                <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                     <UserIcon size={24} className="text-zinc-600" />
                  </div>
                  <p className="text-sm font-medium">No posts yet</p>
                </div>
              </div>
            </motion.div>
          )}

`;

const targetString = `          {activeTab === 'settings' && (`;

if (content.includes(targetString)) {
  const newContent = content.replace(targetString, profileTabCode + targetString);
  fs.writeFileSync('src/App.tsx', newContent);
  console.log('Successfully added profile block.');
} else {
  console.log('Could not find target string');
}
