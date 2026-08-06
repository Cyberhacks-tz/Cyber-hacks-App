const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const networkModalRender = `
      <AnimatePresence>
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
`;

content = content.replace('    </div>\n  );\n}', networkModalRender + '    </div>\n  );\n}');

fs.writeFileSync('src/App.tsx', content);
