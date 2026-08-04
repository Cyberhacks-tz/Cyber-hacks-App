const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 pb-24"
            >
              {(() => {
                const isViewingOther = !!viewingProfileId && viewingProfileId !== user?.uid;
                const displayedProfile = isViewingOther ? users.find(u => u.uid === viewingProfileId) : profile;
                const displayedUid = viewingProfileId || user?.uid;
                const isOwnProfile = !isViewingOther;
                
                const userPosts = posts.filter(p => p.authorId === displayedUid);
                const totalLikes = userPosts.reduce((acc, post) => acc + (post.reactions?.laugh || 0) + (post.reactions?.think || 0) + (post.reactions?.angry || 0), 0);
                const followersCount = (isAdmin && isOwnProfile) ? users.length : 0;
                
                return (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <div className="w-10">
                        {isViewingOther && (
                          <button onClick={() => setViewingProfileId(null)} className="p-2 -ml-2 rounded-full hover:bg-zinc-800/50 transition-colors">
                            <X size={24} className="text-zinc-100" />
                          </button>
                        )}
                      </div>
                      <div className="font-bold text-lg flex items-center gap-1">
                        {displayedProfile?.displayName || 'Profile'}
                        {displayedProfile?.verified && <BadgeCheck size={18} className="text-blue-500" />}
                      </div>
                      <div className="w-10">
                        {isOwnProfile && (
                          <button onClick={() => setActiveTab('settings')} className="p-2 -mr-2 rounded-full hover:bg-zinc-800/50 transition-colors">
                             <Settings size={24} className="text-zinc-100" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between px-2">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700">
                          {displayedProfile?.photoURL ? (
                            <img src={displayedProfile.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <UserIcon size={40} className="text-zinc-600" />
                            </div>
                          )}
                        </div>
                        {isOwnProfile && (
                          <label className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-green-600 to-purple-600 rounded-full border-[3px] border-black hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                            <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                            <Pencil size={14} className="text-white" />
                          </label>
                        )}
                      </div>
                        
                      <div className="flex gap-6">
                        <div className="flex flex-col items-center">
                          <span className="font-black text-xl text-zinc-100">{userPosts.length}</span>
                          <span className="text-xs text-zinc-500 font-medium">Posts</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-black text-xl text-zinc-100">{followersCount}</span>
                          <span className="text-xs text-zinc-500 font-medium">Followers</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-black text-xl text-zinc-100">{totalLikes}</span>
                          <span className="text-xs text-zinc-500 font-medium">Likes</span>
                        </div>
                      </div>
                    </div>
                      
                    <div className="mt-8">
                      <div className="flex border-b border-zinc-800 w-full">
                         <button className="flex-1 py-3 text-sm font-bold uppercase tracking-widest text-zinc-100 border-b-2 border-zinc-100">
                           Posts
                         </button>
                      </div>
                      <div className="py-4 space-y-4 px-2">
                        {userPosts.length === 0 ? (
                          <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                               <UserIcon size={24} className="text-zinc-600" />
                            </div>
                            <p className="text-sm font-medium">No posts yet</p>
                          </div>
                        ) : (
                          userPosts.map((post, i) => (
                            <Card 
                              key={post.id} 
                              {...post} 
                              isAdmin={isAdmin}
                              onDelete={() => setDeleteConfirm({ collection: 'home_posts', id: post.id })}
                              onEdit={() => { setEditingItem(post); setModalOpen('post'); }}
                              userReaction={post.userReactions?.[user?.uid || '']}
                              onReact={(type) => user && handleReaction('home_posts', post.id, type, user.uid)}
                              password={post.password}
                              passwordRequestMsg={post.passwordRequestMsg}
                              t={t}
                              index={i}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}`;

const regex = /\{\s*activeTab === 'profile' && \(\s*<motion\.div[\s\S]*?<\/motion\.div>\s*\)\s*\}/;
content = content.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', content);
