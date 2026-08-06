const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const toInsert = `      <AnimatePresence>
        {networkModalOpen && (
          <NetworkModal
            isOpen={networkModalOpen}
            onClose={() => setNetworkModalOpen(false)}
            initialTab={networkModalTab}
            displayedProfile={activeTab === "profile" ? (viewingProfileId ? users.find(u => u.uid === viewingProfileId) : profile) || null : null}
            currentUserProfile={profile}
            users={users}
            handleToggleFollowGlobal={handleToggleFollowGlobal}
            t={t}
          />
        )}
      </AnimatePresence>
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
    </div>
  );
}`;

content = content.replace(/    <\/div>\s*\);\s*\}/s, toInsert);
fs.writeFileSync('src/App.tsx', content);
