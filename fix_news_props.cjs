const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// NewsCard in home tab
code = code.replace(/<NewsCard \s*key=\{n\.id\} \s*index=\{i\}\s*news=\{n\} \s*isAdmin=\{isAdmin\}\s*onDelete=\{\(\) => setDeleteConfirm\(\{ collection: 'cyber_news', id: n\.id \}\)\}\s*onEdit=\{\(\) => \{\s*setEditingItem\(n\);\s*setModalOpen\('news'\);\s*\}\}\s*onClick=\{\(\) => setSelectedNews\(n\)\}\s*t=\{t\}\s*\/>/g,
  `<NewsCard 
    key={n.id} 
    index={i}
    news={n} 
    isAdmin={isAdmin}
    canEdit={isAdmin || (user && user.uid === n.authorId)}
    onDelete={() => setDeleteConfirm({ collection: 'cyber_news', id: n.id })}
    onEdit={() => {
      setEditingItem(n);
      setModalOpen('news');
    }}
    onClick={() => setSelectedNews(n)}
    t={t}
    author={users.find(u => u.uid === n.authorId)}
    onAuthorClick={() => {
      if (n.authorId) {
        setViewingProfileId(n.authorId);
        setActiveTab('profile');
      }
    }}
    reactions={n.reactions}
    userReaction={user ? (n.userReactions?.[user.uid] as 'like' | null) : null}
    onReact={() => user && handleReact(n.id, 'like')}
  />`);

// NewsCard in profile tab
code = code.replace(/<NewsCard \s*key=\{n\.id\} \s*news=\{n\} \s*isAdmin=\{isAdmin\}\s*onClick=\{\(\) => setSelectedNews\(n\)\}\s*onDelete=\{\(\) => setDeleteConfirm\(\{ collection: 'cyber_news', id: n\.id \}\)\}\s*onEdit=\{\(\) => \{ setEditingItem\(n\); setModalOpen\('news'\); \}\}\s*t=\{t\}\s*index=\{i\}\s*\/>/g,
  `<NewsCard 
    key={n.id} 
    news={n} 
    isAdmin={isAdmin}
    canEdit={isAdmin || (user && user.uid === n.authorId)}
    onClick={() => setSelectedNews(n)}
    onDelete={() => setDeleteConfirm({ collection: 'cyber_news', id: n.id })}
    onEdit={() => { setEditingItem(n); setModalOpen('news'); }}
    t={t}
    index={i}
    author={users.find(u => u.uid === n.authorId)}
    onAuthorClick={() => {
      if (n.authorId) {
        setViewingProfileId(n.authorId);
        setActiveTab('profile');
      }
    }}
    reactions={n.reactions}
    userReaction={user ? (n.userReactions?.[user.uid] as 'like' | null) : null}
    onReact={() => user && handleReact(n.id, 'like')}
  />`);

fs.writeFileSync('src/App.tsx', code);
