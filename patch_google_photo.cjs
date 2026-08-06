const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldLogic = `            if (data.role !== (isAdminEmail ? 'admin' : 'user')) {
              data.role = isAdminEmail ? 'admin' : 'user';
              needsUpdate = true;
              updateData.role = data.role;
            }`;

const newLogic = `            if (data.role !== (isAdminEmail ? 'admin' : 'user')) {
              data.role = isAdminEmail ? 'admin' : 'user';
              needsUpdate = true;
              updateData.role = data.role;
            }
            
            if (data.photoURL && data.photoURL.includes('googleusercontent.com')) {
              data.photoURL = \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${u.uid}\`;
              needsUpdate = true;
              updateData.photoURL = data.photoURL;
            }`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync('src/App.tsx', content);
