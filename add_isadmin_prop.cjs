const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Update AddModal signature
content = content.replace(
  `  initialData?: any\n}) => {`,
  `  initialData?: any,\n  isAdmin?: boolean\n}) => {`
);

// Add isAdmin to AddModal in App
content = content.replace(
  /<AddModal\s+isOpen=\{modalOpen === 'post'\}/g,
  `<AddModal isOpen={modalOpen === 'post'} isAdmin={isAdmin}`
);
content = content.replace(
  /<AddModal\s+isOpen=\{modalOpen === 'premium'\}/g,
  `<AddModal isOpen={modalOpen === 'premium'} isAdmin={isAdmin}`
);
content = content.replace(
  /<AddModal\s+isOpen=\{modalOpen === 'news'\}/g,
  `<AddModal isOpen={modalOpen === 'news'} isAdmin={isAdmin}`
);
content = content.replace(
  /<AddModal\s+isOpen=\{modalOpen === 'chat'\}/g,
  `<AddModal isOpen={modalOpen === 'chat'} isAdmin={isAdmin}`
);

// Also wrap the password inputs.
// In AddModal, the password fields look like: <div className="space-y-1">\n <label ... passwordOptional
const pwdRegex = /<div className="space-y-1">\s*<label className="text-\[10px\] font-black text-zinc-500 uppercase tracking-widest px-2">\{t\('passwordOptional'\)\}<\/label>[\s\S]*?<\/div>\s*<\/div>/g;

content = content.replace(pwdRegex, (match) => {
  return `{isAdmin && (\n              ${match}\n              )}`;
});

fs.writeFileSync('src/App.tsx', content);
