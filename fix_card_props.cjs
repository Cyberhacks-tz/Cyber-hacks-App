const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// For Card in home tab (around line 3382)
code = code.replace(/<Card\s+key=\{post\.id\}\s+index=\{i\}\s+title=\{post\.title\}\s+image=\{post\.image\}\s+link=\{post\.link\}\s+isAdmin=\{isAdmin\}\s+onDelete=\{[^}]+\}\s+onEdit=\{[^}]+\}\s+reactions=\{post\.reactions\}\s+userReaction=\{user \? post\.userReactions\?\.\[user\.uid\] : null\}\s+onReact=\{\(type\) => handleReact\(post\.id, type\)\}\s+createdAt=\{post\.createdAt\}\s+password=\{post\.password\}\s+passwordRequestMsg=\{post\.passwordRequestMsg\}\s+t=\{t\}\s+\/>/, 
  `<Card 
    key={post.id} 
    index={i}
    title={post.title} 
    image={post.image} 
    link={post.link} 
    isAdmin={isAdmin}
    canEdit={isAdmin || (user && user.uid === post.authorId)}
    onDelete={() => setDeleteConfirm({ collection: 'home_posts', id: post.id })}
    onEdit={() => {
      setEditingItem(post);
      setModalOpen('post');
    }}
    reactions={post.reactions}
    userReaction={user ? (post.userReactions?.[user.uid] as 'like' | null) : null}
    onReact={(type) => handleReact(post.id, type)}
    createdAt={post.createdAt}
    password={post.password}
    passwordRequestMsg={post.passwordRequestMsg}
    t={t}
    author={users.find(u => u.uid === post.authorId)}
    onAuthorClick={() => {
      if (post.authorId) {
        setViewingProfileId(post.authorId);
        setActiveTab('profile');
      }
    }}
  />`);

// For Card in profile tab (around line 3663)
code = code.replace(/<Card \s*key=\{post\.id\} \s*\{\.\.\.post\} \s*isAdmin=\{isAdmin\}\s*onDelete=\{[^}]+\}\s*onEdit=\{[^}]+\}\s*userReaction=\{post\.userReactions\?\.\[user\?\.uid \|\| ''\]\}\s*onReact=\{\(type\) => user && handleReact\(post\.id, type\)\}\s*password=\{post\.password\}\s*passwordRequestMsg=\{post\.passwordRequestMsg\}\s*t=\{t\}\s*index=\{i\}\s*\/>/,
  `<Card 
    key={post.id} 
    {...post} 
    isAdmin={isAdmin}
    canEdit={isAdmin || (user && user.uid === post.authorId)}
    onDelete={() => setDeleteConfirm({ collection: 'home_posts', id: post.id })}
    onEdit={() => { setEditingItem(post); setModalOpen('post'); }}
    userReaction={user ? (post.userReactions?.[user.uid] as 'like' | null) : null}
    onReact={(type) => user && handleReact(post.id, type)}
    password={post.password}
    passwordRequestMsg={post.passwordRequestMsg}
    t={t}
    index={i}
    author={users.find(u => u.uid === post.authorId)}
    onAuthorClick={() => {
      if (post.authorId) {
        setViewingProfileId(post.authorId);
        setActiveTab('profile');
      }
    }}
  />`);

fs.writeFileSync('src/App.tsx', code);
