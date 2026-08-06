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

const lastClosingTag = content.lastIndexOf('    </div>\n  );\n}');
if (lastClosingTag !== -1) {
  content = content.substring(0, lastClosingTag) + toInsert + content.substring(lastClosingTag + 16);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Success");
} else {
  console.log("Could not find the end of App component");
}
