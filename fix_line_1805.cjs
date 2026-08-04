const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace("initialData,\n  isAdmin ? t('update') : t('add')", "initialData ? t('update') : t('add')");
content = content.replace("initialData,  isAdmin ? t('update') : t('add')", "initialData ? t('update') : t('add')");

fs.writeFileSync('src/App.tsx', content);
