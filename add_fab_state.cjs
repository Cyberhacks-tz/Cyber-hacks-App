const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);",
  "const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);\n  const [fabOpen, setFabOpen] = useState(false);"
);

fs.writeFileSync('src/App.tsx', content);
