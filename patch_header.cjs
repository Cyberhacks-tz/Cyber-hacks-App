const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldHeader = `      {activeTab !== 'profile' && (
      <header className="sticky top-0 z-40 bg-inherit/80 backdrop-blur-md px-6 py-4 flex justify-between items-center max-w-md mx-auto">
        <div>
          <h1 className="text-xl font-black italic tracking-tighter text-white">CYBER HACKS</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{t('welcome')}, {profile?.displayName.split(' ')[0]}</p>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg shadow-purple-500/20">`;

const newHeader = `      {activeTab !== 'profile' && (
      <header className="sticky top-0 z-40 bg-inherit/80 backdrop-blur-md px-6 py-4 flex items-center justify-between max-w-md mx-auto gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black italic tracking-tighter text-white truncate">CYBER HACKS</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest truncate">{t('welcome')}, {profile?.displayName.split(' ')[0]}</p>
        </div>
        
        <button 
          onClick={() => setUserSearchModalOpen(true)}
          className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors shrink-0 shadow-lg border border-zinc-700"
        >
          <Search size={18} />
        </button>

        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg shadow-purple-500/20 shrink-0 cursor-pointer" onClick={() => setActiveTab('profile')}>`;

content = content.replace(oldHeader, newHeader);

// Now I also need to add the UserSearchModal to the render tree at the bottom
const modalRender = `
      <AnimatePresence>
        {userSearchModalOpen && (
          <UserSearchModal
            isOpen={userSearchModalOpen}
            onClose={() => setUserSearchModalOpen(false)}
            users={users}
            currentUserProfile={profile}
            handleToggleFollowGlobal={handleToggleFollowGlobal}
            onUserSelect={(uid) => {
              setViewingProfileId(uid);
              setActiveTab('profile');
              setUserSearchModalOpen(false);
            }}
            t={t}
          />
        )}
      </AnimatePresence>
`;

content = content.replace('    </div>\n  );\n}', modalRender + '    </div>\n  );\n}');

fs.writeFileSync('src/App.tsx', content);
