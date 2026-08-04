const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const aiPromptCardMapRegex = /author=\{users\.find\(u => u\.uid === (p|prompt)\.authorId\)\}\s+onAuthorClick=\{\(\) => \{\s+if \(\1\.authorId\) \{\s+setViewingProfileId\(\1\.authorId\);\s+setActiveTab\('profile'\);\s+\}\s+\}\}/g;
content = content.replace(aiPromptCardMapRegex, match => `${match}\n    currentUserId={user?.uid}\n    onFollowToggle={handleToggleFollowGlobal}`);

fs.writeFileSync('src/App.tsx', content);
