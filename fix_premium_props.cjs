const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// For PremiumCard in home tab
code = code.replace(/<PremiumCard \s*key=\{app\.id\} \s*index=\{i\}\s*app=\{app\} \s*isPremium=\{true\} \s*onDownload=\{\(\) => \{\s*handleExternalLink\(app\.downloadLink\);\s*\}\}\s*isAdmin=\{isAdmin\}\s*onDelete=\{\(\) => setDeleteConfirm\(\{ collection: 'premium_apk', id: app\.id \}\)\}\s*onEdit=\{\(\) => \{\s*setEditingItem\(app\);\s*setModalOpen\('app'\);\s*\}\}\s*t=\{t\}\s*\/>/g,
  `<PremiumCard 
    key={app.id} 
    index={i}
    app={app} 
    isPremium={true} 
    onDownload={() => {
      handleExternalLink(app.downloadLink);
    }}
    isAdmin={isAdmin}
    canEdit={isAdmin || (user && user.uid === app.authorId)}
    onDelete={() => setDeleteConfirm({ collection: 'premium_apk', id: app.id })}
    onEdit={() => {
      setEditingItem(app);
      setModalOpen('app');
    }}
    t={t}
    author={users.find(u => u.uid === app.authorId)}
    onAuthorClick={() => {
      if (app.authorId) {
        setViewingProfileId(app.authorId);
        setActiveTab('profile');
      }
    }}
    reactions={app.reactions}
    userReaction={user ? (app.userReactions?.[user.uid] as 'like' | null) : null}
    onReact={() => user && handleReact(app.id, 'like')}
  />`);

// For PremiumCard in profile tab
code = code.replace(/<PremiumCard \s*key=\{app\.id\} \s*app=\{app\} \s*onDownload=\{\(\) => handleExternalLink\(app\.downloadLink \|\| ''\)\} \s*isAdmin=\{isAdmin\}\s*onDelete=\{\(\) => setDeleteConfirm\(\{ collection: 'premium_apk', id: app\.id \}\)\}\s*onEdit=\{\(\) => \{ setEditingItem\(app\); setModalOpen\('app'\); \}\}\s*t=\{t\}\s*index=\{i\}\s*\/>/g,
  `<PremiumCard 
    key={app.id} 
    app={app} 
    isPremium={true}
    onDownload={() => handleExternalLink(app.downloadLink || '')} 
    isAdmin={isAdmin}
    canEdit={isAdmin || (user && user.uid === app.authorId)}
    onDelete={() => setDeleteConfirm({ collection: 'premium_apk', id: app.id })}
    onEdit={() => { setEditingItem(app); setModalOpen('app'); }}
    t={t}
    index={i}
    author={users.find(u => u.uid === app.authorId)}
    onAuthorClick={() => {
      if (app.authorId) {
        setViewingProfileId(app.authorId);
        setActiveTab('profile');
      }
    }}
    reactions={app.reactions}
    userReaction={user ? (app.userReactions?.[user.uid] as 'like' | null) : null}
    onReact={() => user && handleReact(app.id, 'like')}
  />`);

fs.writeFileSync('src/App.tsx', code);
