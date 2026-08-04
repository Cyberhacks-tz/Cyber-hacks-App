const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// AiPromptCard in home tab
code = code.replace(/<AiPromptCard \s*key=\{p\.id\} \s*index=\{i\}\s*prompt=\{p\} \s*isAdmin=\{isAdmin\}\s*onDelete=\{\(\) => setDeleteConfirm\(\{ collection: 'ai_prompts', id: p\.id \}\)\}\s*onEdit=\{\(\) => \{\s*setEditingItem\(p\);\s*setModalOpen\('aiprompt'\);\s*\}\}\s*onClick=\{\(\) => setSelectedPrompt\(p\)\}\s*\/>/g,
  `<AiPromptCard 
    key={p.id} 
    index={i}
    prompt={p} 
    isAdmin={isAdmin}
    canEdit={isAdmin || (user && user.uid === p.authorId)}
    onDelete={() => setDeleteConfirm({ collection: 'ai_prompts', id: p.id })}
    onEdit={() => {
      setEditingItem(p);
      setModalOpen('aiprompt');
    }}
    onClick={() => setSelectedPrompt(p)}
    author={users.find(u => u.uid === p.authorId)}
    onAuthorClick={() => {
      if (p.authorId) {
        setViewingProfileId(p.authorId);
        setActiveTab('profile');
      }
    }}
    reactions={p.reactions}
    userReaction={user ? (p.userReactions?.[user.uid] as 'like' | null) : null}
    onReact={() => user && handleReact(p.id, 'like')}
  />`);

// AiPromptCard in profile tab
code = code.replace(/<AiPromptCard \s*key=\{prompt\.id\} \s*prompt=\{prompt\} \s*isAdmin=\{isAdmin\}\s*onClick=\{\(\) => setSelectedPrompt\(prompt\)\}\s*onDelete=\{\(\) => setDeleteConfirm\(\{ collection: 'ai_prompts', id: prompt\.id \}\)\}\s*onEdit=\{\(\) => \{ setEditingItem\(prompt\); setModalOpen\('aiprompt'\); \}\}\s*index=\{i\}\s*\/>/g,
  `<AiPromptCard 
    key={prompt.id} 
    prompt={prompt} 
    isAdmin={isAdmin}
    canEdit={isAdmin || (user && user.uid === prompt.authorId)}
    onClick={() => setSelectedPrompt(prompt)}
    onDelete={() => setDeleteConfirm({ collection: 'ai_prompts', id: prompt.id })}
    onEdit={() => { setEditingItem(prompt); setModalOpen('aiprompt'); }}
    index={i}
    author={users.find(u => u.uid === prompt.authorId)}
    onAuthorClick={() => {
      if (prompt.authorId) {
        setViewingProfileId(prompt.authorId);
        setActiveTab('profile');
      }
    }}
    reactions={prompt.reactions}
    userReaction={user ? (prompt.userReactions?.[user.uid] as 'like' | null) : null}
    onReact={() => user && handleReact(prompt.id, 'like')}
  />`);

fs.writeFileSync('src/App.tsx', code);
