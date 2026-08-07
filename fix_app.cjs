const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add getAuthor inside App component
const getAuthorFunc = `  const getAuthor = (item: any) => {
    if (item.authorId) {
      return users.find(u => u.uid === item.authorId);
    }
    return users.find(u => u.email === 'richarddeogtatius18@gmail.com');
  };`;

content = content.replace("const [user, setUser] = useState<User | null>(null);", getAuthorFunc + "\n  const [user, setUser] = useState<User | null>(null);");

// 2. Replace author prop
content = content.replace(/author=\{users\.find\(u => u\.uid === [^\.]+\.authorId\)\}/g, (match) => {
  // extract the variable name, e.g. post, app, n, p, prompt
  const varName = match.match(/u\.uid === ([^\.]+)\.authorId/)[1];
  return `author={getAuthor(${varName})}`;
});

// 3. Fix totalLikes
const oldLikes = `                const totalLikes = userPosts.reduce((acc, post) => {
                  return acc + (post.reactions?.like || 0);
                }, 0);`;
const newLikes = `                const totalLikes = 
                  userPosts.reduce((acc, post) => acc + (post.reactions?.like || 0), 0) +
                  userApps.reduce((acc, app) => acc + (app.reactions?.like || 0), 0) +
                  userNews.reduce((acc, n) => acc + (n.reactions?.like || 0), 0) +
                  userPrompts.reduce((acc, p) => acc + (p.reactions?.like || 0), 0);`;
content = content.replace(oldLikes, newLikes);

fs.writeFileSync('src/App.tsx', content);
