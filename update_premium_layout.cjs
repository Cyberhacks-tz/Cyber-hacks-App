const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldStructure = `      className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex gap-4 items-center shadow-lg relative overflow-hidden"
    >
      {isDownloading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[1px] flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Download size={24} className="text-green-400" />
          </motion.div>
        </motion.div>
      )}
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-zinc-800">
        {app.image ? (
          <img src={app.image} alt={app.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Shield size={24} className="text-zinc-700" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-zinc-100 truncate">
          {app.name} {app.password && app.password.trim() !== '' && <span className="ml-1" title="Premium">👑</span>}
        </h3>
        <div className="relative">
          <p className={cn("text-xs text-zinc-400 whitespace-pre-wrap", !isExpanded && "line-clamp-2")}>
            {app.description || ''}
          </p>
          {((app.description || '').length > 50 || (app.description || '').includes('\n')) && (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} 
              className="text-xs text-green-400 font-medium mt-1 hover:underline"
            >
              {isExpanded ? t('seeLess') : t('seeMore')}
            </button>
          )}
        </div>
        {(isAdmin || canEdit) && app.password && (
          <div className="mt-1 px-2 py-0.5 bg-black/80 text-green-400 rounded text-[10px] font-mono inline-flex items-center gap-1">
            <Key size={10} /> {app.password}
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
          <div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0" onClick={(e) => {
            if(onAuthorClick) { e.stopPropagation(); onAuthorClick(); }
          }}>
            {author?.photoURL ? (
              <img src={author.photoURL} alt={author.displayName} className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-zinc-600" />
            ) : (
              <div className="w-8 h-8 rounded-full flex-shrink-0 bg-zinc-700 flex items-center justify-center border border-zinc-600">
                <UserIcon size={14} className="text-zinc-400" />
              </div>
            )}
            <div className="flex items-center min-w-0">
              <span className="text-xs font-bold text-zinc-200 hover:underline truncate">{author?.displayName || 'User'}</span>
              {author?.verified && <BadgeCheck size={14} className="text-blue-500 ml-1 flex-shrink-0" />}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {author && currentUserId && author.uid !== currentUserId && onFollowToggle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFollowToggle(author.uid);
                }}
                className={cn("px-4 py-1.5 rounded-full text-[10px] font-bold transition-colors shadow-sm", 
                  author.followers?.includes(currentUserId) 
                  ? "bg-zinc-800 text-zinc-400" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                {author.followers?.includes(currentUserId) ? 'Following' : 'Follow'}
              </button>
            )}
            <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onReact?.('like'); }}
            className={\`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full transition-colors duration-300 \${userReaction === 'like' ? 'bg-red-900/30 text-red-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-red-500'}\`}
          >
            <Heart size={12} className={(userReaction === "like") ? "fill-red-500 text-red-500" : "fill-transparent text-zinc-800 dark:text-zinc-300"} />
          </motion.button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">`;

const newStructure = `      className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex flex-col gap-4 shadow-lg relative overflow-hidden"
    >
      {isDownloading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[1px] flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Download size={24} className="text-green-400" />
          </motion.div>
        </motion.div>
      )}
      <div className="flex gap-4 items-center">
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-zinc-800">
          {app.image ? (
            <img src={app.image} alt={app.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Shield size={24} className="text-zinc-700" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-zinc-100 truncate">
            {app.name} {app.password && app.password.trim() !== '' && <span className="ml-1" title="Premium">👑</span>}
          </h3>
          <div className="relative">
            <p className={cn("text-xs text-zinc-400 whitespace-pre-wrap", !isExpanded && "line-clamp-2")}>
              {app.description || ''}
            </p>
            {((app.description || '').length > 50 || (app.description || '').includes('\\n')) && (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} 
                className="text-xs text-green-400 font-medium mt-1 hover:underline"
              >
                {isExpanded ? t('seeLess') : t('seeMore')}
              </button>
            )}
          </div>
          {(isAdmin || canEdit) && app.password && (
            <div className="mt-1 px-2 py-0.5 bg-black/80 text-green-400 rounded text-[10px] font-mono inline-flex items-center gap-1">
              <Key size={10} /> {app.password}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button 
            onClick={handleDownload}
            className="p-3 rounded-xl transition-all bg-gradient-to-r from-green-600 to-purple-600 text-zinc-100 hover:from-green-500 hover:to-purple-500"
          >
            <Download size={20} />
          </button>
          {isAdmin && (
            <div className="flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="p-3 bg-zinc-800 text-zinc-400 rounded-xl hover:bg-zinc-700 transition-colors"
              >
                <Pencil size={20} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                className="p-3 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
        <div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0" onClick={(e) => {
          if(onAuthorClick) { e.stopPropagation(); onAuthorClick(); }
        }}>
          {author?.photoURL ? (
            <img src={author.photoURL} alt={author.displayName} className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-zinc-600" />
          ) : (
            <div className="w-8 h-8 rounded-full flex-shrink-0 bg-zinc-700 flex items-center justify-center border border-zinc-600">
              <UserIcon size={14} className="text-zinc-400" />
            </div>
          )}
          <div className="flex items-center min-w-0">
            <span className="text-xs font-bold text-zinc-200 hover:underline truncate">{author?.displayName || 'User'}</span>
            {author?.verified && <BadgeCheck size={14} className="text-blue-500 ml-1 flex-shrink-0" />}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {author && currentUserId && author.uid !== currentUserId && onFollowToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFollowToggle(author.uid);
              }}
              className={cn("px-4 py-1.5 rounded-full text-[10px] font-bold transition-colors shadow-sm", 
                author.followers?.includes(currentUserId) 
                ? "bg-zinc-800 text-zinc-400" 
                : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              {author.followers?.includes(currentUserId) ? 'Following' : 'Follow'}
            </button>
          )}
          <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); onReact?.('like'); }}
          className={\`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full transition-colors duration-300 \${userReaction === 'like' ? 'bg-red-900/30 text-red-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-red-500'}\`}
        >
          <Heart size={12} className={(userReaction === "like") ? "fill-red-500 text-red-500" : "fill-transparent text-zinc-800 dark:text-zinc-300"} />
        </motion.button>
        </div>
      </div>
    </motion.div>
    <PasswordModal`;

const fullRegexMatch = content.indexOf('className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex gap-4 items-center shadow-lg relative overflow-hidden"');
if(fullRegexMatch !== -1) {
   let slice1 = content.slice(0, fullRegexMatch);
   let slice2 = content.slice(fullRegexMatch);
   let replaced = slice2.replace(oldStructure, newStructure);
   
   // Clean up the trailing parts we didn't include in newStructure exactly
   // Wait, I left `<PasswordModal` at the end of newStructure to serve as a marker.
   // Let's use a simpler replace strategy.
   
   let oldStr = content.substring(content.indexOf('className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex gap-4 items-center shadow-lg relative overflow-hidden"'));
   oldStr = oldStr.substring(0, oldStr.indexOf('<PasswordModal'));
   
   let newStr = newStructure.substring(0, newStructure.indexOf('<PasswordModal'));
   
   content = content.replace(oldStr, newStr);
   fs.writeFileSync('src/App.tsx', content);
   console.log("Replaced");
} else {
   console.log("Not found");
}

