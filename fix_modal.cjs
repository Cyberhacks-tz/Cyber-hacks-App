const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldModalContent = `              <div className="space-y-3">
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
                )}`;

const newModalContent = `              <div className="space-y-3">
                {!selectedUserForAction.verified ? (
                  <div className="flex gap-2">
                    <button onClick={() => {
                      if (window.confirm("Verify this account (Type 1 - Facebook Style)?")) {
                        updateDoc(doc(db, 'users', selectedUserForAction.uid), { verified: true, verifiedType: '1' }).then(() => setSelectedUserForAction(null));
                      }
                    }} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-colors text-xs">
                      <VerifiedBadge type="1" size={20} /> Verify (Type 1)
                    </button>
                    <button onClick={() => {
                      if (window.confirm("Verify this account (Type 2 - Default)?")) {
                        updateDoc(doc(db, 'users', selectedUserForAction.uid), { verified: true, verifiedType: '2' }).then(() => setSelectedUserForAction(null));
                      }
                    }} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-colors text-xs">
                      <VerifiedBadge type="2" size={20} /> Verify (Type 2)
                    </button>
                  </div>
                ) : (
                  <button onClick={() => {
                    if (window.confirm("Remove verification from this account?")) {
                      updateDoc(doc(db, 'users', selectedUserForAction.uid), { verified: false, verifiedType: null }).then(() => setSelectedUserForAction(null));
                    }
                  }} className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <X size={18} /> Remove Verification
                  </button>
                )}
                
                {!selectedUserForAction.banned ? (
                  <button onClick={() => {
                    if (window.confirm("Are you sure you want to ban this account?")) {
                      updateDoc(doc(db, 'users', selectedUserForAction.uid), { banned: true }).then(() => setSelectedUserForAction(null));
                    }
                  }} className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <Ban size={18} /> Ban Account
                  </button>
                ) : (
                  <button onClick={() => {
                    if (window.confirm("Are you sure you want to unban this account?")) {
                      updateDoc(doc(db, 'users', selectedUserForAction.uid), { banned: false }).then(() => setSelectedUserForAction(null));
                    }
                  }} className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <Check size={18} /> Unban Account
                  </button>
                )}`;

content = content.replace(oldModalContent, newModalContent);
fs.writeFileSync('src/App.tsx', content);
