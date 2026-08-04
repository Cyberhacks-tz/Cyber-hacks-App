const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `<Navbar activeTab={activeTab} setActiveTab={setActiveTab} t={t} theme={theme} />`;

const fabUI = `      {/* Floating Action Button */}
      {user && (
        <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end">
          <AnimatePresence>
            {fabOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="flex flex-col gap-3 mb-4 items-end"
              >
                <button
                  onClick={() => { setModalOpen('chat'); setFabOpen(false); }}
                  className="flex items-center gap-3 bg-zinc-900 text-zinc-100 px-4 py-2 rounded-full shadow-lg border border-zinc-700 hover:bg-zinc-800 transition-colors"
                >
                  <span className="text-sm font-medium">AI Prompt</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-purple-600 flex items-center justify-center">
                    <MessageSquare size={14} className="text-white" />
                  </div>
                </button>
                <button
                  onClick={() => { setModalOpen('news'); setFabOpen(false); }}
                  className="flex items-center gap-3 bg-zinc-900 text-zinc-100 px-4 py-2 rounded-full shadow-lg border border-zinc-700 hover:bg-zinc-800 transition-colors"
                >
                  <span className="text-sm font-medium">Cyber News</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-purple-600 flex items-center justify-center">
                    <Newspaper size={14} className="text-white" />
                  </div>
                </button>
                <button
                  onClick={() => { setModalOpen('premium'); setFabOpen(false); }}
                  className="flex items-center gap-3 bg-zinc-900 text-zinc-100 px-4 py-2 rounded-full shadow-lg border border-zinc-700 hover:bg-zinc-800 transition-colors"
                >
                  <span className="text-sm font-medium">Premium</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-purple-600 flex items-center justify-center">
                    <Shield size={14} className="text-white" />
                  </div>
                </button>
                <button
                  onClick={() => { setModalOpen('post'); setFabOpen(false); }}
                  className="flex items-center gap-3 bg-zinc-900 text-zinc-100 px-4 py-2 rounded-full shadow-lg border border-zinc-700 hover:bg-zinc-800 transition-colors"
                >
                  <span className="text-sm font-medium">Hack</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-purple-600 flex items-center justify-center">
                    <Home size={14} className="text-white" />
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setFabOpen(!fabOpen)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-purple-600 text-white px-5 py-3 rounded-full shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all z-50 border-2 border-black"
          >
            {fabOpen ? <X size={20} /> : <Plus size={20} />}
            <span className="font-bold tracking-widest uppercase text-sm">Add</span>
          </button>
        </div>
      )}
`;

content = content.replace(targetStr, fabUI + '\n      ' + targetStr);
fs.writeFileSync('src/App.tsx', content);
console.log("Added FAB UI");
