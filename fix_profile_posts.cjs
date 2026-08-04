const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add authorId to onAdd
content = content.replace(
  "await addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp() });",
  "await addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp(), authorId: user?.uid });"
);

// 2. Filter posts in profile tab
const profilePostsStr = `<span className="font-black text-xl text-zinc-100">{filteredPosts.length}</span>`;
const newProfilePostsStr = `{(() => {
                      const userPosts = posts.filter(p => p.authorId === user?.uid);
                      return (
                        <>
                          <span className="font-black text-xl text-zinc-100">{userPosts.length}</span>
                        </>
                      );
                    })()}`;
content = content.replace(profilePostsStr, newProfilePostsStr);

// 3. Render posts instead of "No posts yet"
const noPostsStr = `<div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                     <UserIcon size={24} className="text-zinc-600" />
                  </div>
                  <p className="text-sm font-medium">No posts yet</p>
                </div>`;
const newPostsStr = `<div className="py-4 space-y-4 px-2">
                  {posts.filter(p => p.authorId === user?.uid).length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                      <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                         <UserIcon size={24} className="text-zinc-600" />
                      </div>
                      <p className="text-sm font-medium">No posts yet</p>
                    </div>
                  ) : (
                    posts.filter(p => p.authorId === user?.uid).map((post, i) => (
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
                </div>`;
content = content.replace(noPostsStr, newPostsStr);

fs.writeFileSync('src/App.tsx', content);
