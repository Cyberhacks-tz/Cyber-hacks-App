const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetString = `          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 pb-24"
            >
              <section className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">`;

const newHeader = `          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 pb-24"
            >
              <div className="flex items-center gap-4 mb-2">
                <button onClick={() => setActiveTab('profile')} className="p-2 -ml-2 rounded-full hover:bg-zinc-800/50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-left text-zinc-100"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                </button>
                <div className="font-bold text-lg">{t('settings')}</div>
              </div>
              <section className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">`;

if (content.includes(targetString)) {
  content = content.replace(targetString, newHeader);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Updated settings header");
} else {
  console.log("Could not find target string");
}
