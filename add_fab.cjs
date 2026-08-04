const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const fabCode = `
      {/* Floating Action Button */}
      {user && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
          <AnimatePresence>
            {fabOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="flex flex-col gap-2 pointer-events-auto"
              >
                <button onClick={() => { setModalOpen('chat'); setFabOpen(false); }} className="flex items-center justify-end gap-3 group">
                  <span className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:bg-purple-600 transition-colors border border-white/10">AI Promt</span>
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-500 transition-colors shadow-lg shadow-black/20">
                    <MessageSquare size={18} />
                  </div>
                </button>
                <button onClick={() => { setModalOpen('news'); setFabOpen(false); }} className="flex items-center justify-end gap-3 group">
                  <span className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:bg-blue-500 transition-colors border border-white/10">Cyber News</span>
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-colors shadow-lg shadow-black/20">
                    <Newspaper size={18} />
                  </div>
                </button>
                <button onClick={() => { setModalOpen('premium'); setFabOpen(false); }} className="flex items-center justify-end gap-3 group">
                  <span className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:bg-yellow-500 transition-colors border border-white/10">Premium</span>
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:bg-yellow-500 group-hover:text-white group-hover:border-yellow-500 transition-colors shadow-lg shadow-black/20">
                    <Shield size={18} />
                  </div>
                </button>
                <button onClick={() => { setModalOpen('post'); setFabOpen(false); }} className="flex items-center justify-end gap-3 group">
                  <span className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:bg-green-500 transition-colors border border-white/10">Hack</span>
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:bg-green-500 group-hover:text-white group-hover:border-green-500 transition-colors shadow-lg shadow-black/20">
                    <Home size={18} />
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setFabOpen(!fabOpen)}
            className="w-14 h-14 bg-gradient-to-r from-green-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-transform pointer-events-auto border-2 border-black"
          >
            <motion.div
              animate={{ rotate: fabOpen ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Plus size={24} />
            </motion.div>
          </button>
        </div>
      )}
`;

const targetStr = `      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} t={t} theme={theme} />`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, fabCode + '\n' + targetStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Added FAB");
} else {
  console.log("Could not find Navbar string");
}
