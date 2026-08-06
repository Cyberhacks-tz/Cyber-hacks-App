const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldAuthorHTML = `              <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer flex-1 min-w-0" onClick={(e) => {
            if(onAuthorClick) { e.stopPropagation(); onAuthorClick(); }
          }}>
            {author?.photoURL ? (
              <img src={author.photoURL} alt={author.displayName} className="w-5 h-5 rounded-full flex-shrink-0 object-cover border border-zinc-700" />
            ) : (
              <div className="w-5 h-5 rounded-full flex-shrink-0 bg-zinc-700 flex items-center justify-center">
                <UserIcon size={10} className="text-zinc-400" />
              </div>
            )}
            <div className="flex items-center min-w-0">
              <span className="text-[10px] font-medium text-zinc-400 hover:underline truncate">{author?.displayName || 'User'}</span>
              {author?.verified && <BadgeCheck size={10} className="text-blue-500 ml-1 flex-shrink-0" />}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {author && currentUserId && author.uid !== currentUserId && onFollowToggle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFollowToggle(author.uid);
                }}
                className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold transition-colors", 
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
        </div>`;

// 1. Put old author back to flex-1 min-w-0
content = content.replace(
  /\{\(isAdmin \|\| canEdit\) && app\.password && \([\s\S]*?<\/div>\s*\)\}\s*<\/div>/,
  `{(isAdmin || canEdit) && app.password && (
          <div className="mt-1 px-2 py-0.5 bg-black/80 text-green-400 rounded text-[10px] font-mono inline-flex items-center gap-1">
            <Key size={10} /> {app.password}
          </div>
        )}
${oldAuthorHTML}
      </div>`
);

// 2. Remove from right side
content = content.replace(/<div className="flex flex-col gap-2 justify-between h-full items-end">([\s\S]*?)<div className="mt-auto pt-2 flex flex-col items-end gap-2">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '<div className="flex flex-col gap-2">$1</div>');
content = content.replace('className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex gap-4 items-stretch shadow-lg relative overflow-hidden"', 'className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex gap-4 items-center shadow-lg relative overflow-hidden"');

fs.writeFileSync('src/App.tsx', content);
