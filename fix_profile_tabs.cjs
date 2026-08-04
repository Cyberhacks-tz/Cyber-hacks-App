const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const profileTabState = `  const [profileTab, setProfileTab] = useState<'hacks' | 'apps' | 'news' | 'aiprompts'>('hacks');`;

content = content.replace("  const [activeTab, setActiveTab] = useState('home');", "  const [activeTab, setActiveTab] = useState('home');\n" + profileTabState);

const tabsHtml = `                    <div className="mt-8">
                      <div className="flex border-b border-zinc-800 w-full overflow-x-auto no-scrollbar">
                         <button onClick={() => setProfileTab('hacks')} className={cn("flex-1 whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest", profileTab === 'hacks' ? "text-zinc-100 border-b-2 border-zinc-100" : "text-zinc-500 hover:text-zinc-300")}>
                           Hacks
                         </button>
                         <button onClick={() => setProfileTab('apps')} className={cn("flex-1 whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest", profileTab === 'apps' ? "text-zinc-100 border-b-2 border-zinc-100" : "text-zinc-500 hover:text-zinc-300")}>
                           Premium
                         </button>
                         <button onClick={() => setProfileTab('news')} className={cn("flex-1 whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest", profileTab === 'news' ? "text-zinc-100 border-b-2 border-zinc-100" : "text-zinc-500 hover:text-zinc-300")}>
                           News
                         </button>
                         <button onClick={() => setProfileTab('aiprompts')} className={cn("flex-1 whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest", profileTab === 'aiprompts' ? "text-zinc-100 border-b-2 border-zinc-100" : "text-zinc-500 hover:text-zinc-300")}>
                           AI Prompts
                         </button>
                      </div>
                      <div className="py-4 space-y-4 px-2">
                        {profileTab === 'hacks' && (
                          userPosts.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                                 <Home size={24} className="text-zinc-600" />
                              </div>
                              <p className="text-sm font-medium">No hacks posted yet</p>
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
                                onReact={(type) => user && handleReact(post.id, type)}
                                password={post.password}
                                passwordRequestMsg={post.passwordRequestMsg}
                                t={t}
                                index={i}
                              />
                            ))
                          )
                        )}
                        
                        {profileTab === 'apps' && (
                          (() => {
                            const userApps = premiumApps.filter(a => a.authorId === displayedUid);
                            if (userApps.length === 0) return (
                              <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                                   <Shield size={24} className="text-zinc-600" />
                                </div>
                                <p className="text-sm font-medium">No apps posted yet</p>
                              </div>
                            );
                            return userApps.map((app, i) => (
                              <PremiumCard 
                                key={app.id} 
                                app={app} 
                                onDownload={() => handleExternalLink(app.downloadLink || '')} 
                                isAdmin={isAdmin}
                                onDelete={() => setDeleteConfirm({ collection: 'premium_apk', id: app.id })}
                                onEdit={() => { setEditingItem(app); setModalOpen('app'); }}
                                t={t}
                                index={i}
                              />
                            ));
                          })()
                        )}

                        {profileTab === 'news' && (
                          (() => {
                            const userNews = news.filter(n => n.authorId === displayedUid);
                            if (userNews.length === 0) return (
                              <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                                   <Newspaper size={24} className="text-zinc-600" />
                                </div>
                                <p className="text-sm font-medium">No news posted yet</p>
                              </div>
                            );
                            return userNews.map((n, i) => (
                              <NewsCard 
                                key={n.id} 
                                news={n} 
                                isAdmin={isAdmin}
                                onClick={() => setSelectedNews(n)}
                                onDelete={() => setDeleteConfirm({ collection: 'cyber_news', id: n.id })}
                                onEdit={() => { setEditingItem(n); setModalOpen('news'); }}
                                t={t}
                                index={i}
                              />
                            ));
                          })()
                        )}

                        {profileTab === 'aiprompts' && (
                          (() => {
                            const userPrompts = aiPrompts.filter(p => p.authorId === displayedUid);
                            if (userPrompts.length === 0) return (
                              <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                                   <MessageSquare size={24} className="text-zinc-600" />
                                </div>
                                <p className="text-sm font-medium">No prompts posted yet</p>
                              </div>
                            );
                            return userPrompts.map((prompt, i) => (
                              <AiPromptCard 
                                key={prompt.id} 
                                prompt={prompt} 
                                isAdmin={isAdmin}
                                onClick={() => setSelectedPrompt(prompt)}
                                onDelete={() => setDeleteConfirm({ collection: 'ai_prompts', id: prompt.id })}
                                onEdit={() => { setEditingItem(prompt); setModalOpen('aiprompt'); }}
                                index={i}
                              />
                            ));
                          })()
                        )}
                      </div>
                    </div>`;

const regex = /<div className="mt-8">[\s\S]*?<\/div>\s*<\/div>\s*<\/>\s*\);\s*\}\)\(\)\}\s*<\/motion.div>\s*\)}/;

content = content.replace(regex, tabsHtml + "\n                  </>\n                );\n              })()}\n            </motion.div>\n          )}");

fs.writeFileSync('src/App.tsx', content);
