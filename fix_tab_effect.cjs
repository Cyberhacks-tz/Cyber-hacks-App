const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /(useEffect\(\(\) => \{\n    const saved = localStorage.getItem\('appTheme'\);[\s\S]*?\}\), \[\]\);)/;
content = content.replace(regex, `$1

  useEffect(() => {
    if (activeTab !== 'profile') {
      setViewingProfileId(null);
    }
  }, [activeTab]);
`);

fs.writeFileSync('src/App.tsx', content);
