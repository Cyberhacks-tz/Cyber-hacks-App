const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const userModalStr = `      </AnimatePresence>

      <AnimatePresence>
        {selectedUserForAction && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                {selectedUserForAction.photoURL ? (
                  <img src={selectedUserForAction.photoURL} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                    <UserIcon size={24} className="text-zinc-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-black text-white leading-tight flex items-center gap-1">
                    {selectedUserForAction.displayName}
                    {selectedUserForAction.verified && <BadgeCheck size={16} className="text-blue-500" />}
                  </h3>
                  <div className="text-xs text-zinc-500">{selectedUserForAction.email}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {!selectedUserForAction.verified && (
                  <button onClick={() => {
                    if (window.confirm("Are you sure you want to verify this account?")) {
                      updateDoc(doc(db, 'users', selectedUserForAction.uid), { verified: true }).then(() => setSelectedUserForAction(null));
                    }
                  }} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <BadgeCheck size={18} /> Verify User
                  </button>
                )}
                
                {!selectedUserForAction.banned && (
                  <button onClick={() => {
                    if (window.confirm("Are you sure you want to ban this account?")) {
                      updateDoc(doc(db, 'users', selectedUserForAction.uid), { banned: true }).then(() => setSelectedUserForAction(null));
                    }
                  }} className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <Ban size={18} /> Ban Account
                  </button>
                )}
                
                <button onClick={() => {
                  setViewingProfileId(selectedUserForAction.uid);
                  setActiveTab('profile');
                  setSelectedUserForAction(null);
                }} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                  <UserIcon size={18} /> View Profile
                </button>
                
                <button onClick={() => setSelectedUserForAction(null)} className="w-full bg-transparent text-zinc-500 hover:text-zinc-300 py-3 rounded-xl font-bold mt-4 border border-zinc-800 transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>`;

content = content.replace("      </AnimatePresence>\n      <AnimatePresence>\n        {modalOpen && (", userModalStr + "\n      <AnimatePresence>\n        {modalOpen && (");

fs.writeFileSync('src/App.tsx', content);
