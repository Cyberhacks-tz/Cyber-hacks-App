const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const rendererStart = content.indexOf('const MarkdownRenderer');
const passwordModalStart = content.indexOf('const PasswordModal');

let rendererBlock = content.substring(rendererStart, passwordModalStart);

// Remove all <AnimatePresence> blocks from the renderer block
rendererBlock = rendererBlock.replace(/<AnimatePresence>[\s\S]*?<\/AnimatePresence>/g, '');

content = content.substring(0, rendererStart) + rendererBlock + content.substring(passwordModalStart);

// Put ONE copy of the modals at the end of the App component before </div>
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
}
export default App;`;

content = content.replace(/    <\/div>\s*\);\s*\}\s*export default App;/s, toInsert);

fs.writeFileSync('src/App.tsx', content);
