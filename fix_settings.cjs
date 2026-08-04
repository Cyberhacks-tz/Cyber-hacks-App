const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const settingsSection = `              <section className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-800">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserIcon size={32} className="text-zinc-700" />
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 p-1 bg-black/50 text-white cursor-pointer w-full text-center">
                      <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                      <Pencil size={12} className="mx-auto" />
                    </label>
                  </div>
                  <div className="flex-1">
                    {editingUsername ? (
                      <div className="flex gap-2">
                        <input 
                          autoFocus
                          value={newUsername} 
                          onChange={e => setNewUsername(e.target.value)}
                          className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 flex-1 text-sm outline-none focus:border-purple-500 text-white"
                          placeholder="New username"
                        />
                        <button 
                          onClick={async () => {
                            if (!newUsername.trim() || !user) return;
                            try {
                              setGlobalLoading(true);
                              await updateProfile(user, { displayName: newUsername });
                              await setDoc(doc(db, 'users', user.uid), { displayName: newUsername }, { merge: true });
                              if (profile) setProfile({ ...profile, displayName: newUsername });
                              setEditingUsername(false);
                            } catch(e) {
                              console.error(e);
                              alert("Failed to update username");
                            } finally {
                              setGlobalLoading(false);
                            }
                          }}
                          className="bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-white">{profile?.displayName}</h3>
                        <button onClick={() => { setNewUsername(profile?.displayName || ''); setEditingUsername(true); }} className="text-zinc-500 hover:text-white">
                           <Pencil size={14} />
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-zinc-500">{profile?.email}</p>
                    <span className={cn(
                      "inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black uppercase",
                      profile?.isPremium ? "bg-gradient-to-r from-green-600 to-purple-600 text-zinc-100" : "bg-zinc-800 text-zinc-400"
                    )}>
                      {profile?.isPremium ? t('premiumMember') : t('freeMember')}
                    </span>
                  </div>
                </div>`;

const regex = /<section className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(regex, settingsSection);
fs.writeFileSync('src/App.tsx', content);
