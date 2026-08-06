const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const authorSectionHTML = `          <div className="mt-auto pt-2 flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => {
              if(onAuthorClick) { e.stopPropagation(); onAuthorClick(); }
            }}>
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  <span className="text-xs font-semibold text-zinc-300 hover:underline">{author?.displayName || 'User'}</span>
                  {author?.verified && <BadgeCheck size={12} className="text-blue-500 ml-1 flex-shrink-0" />}
                </div>
              </div>
              {author?.photoURL ? (
                <img src={author.photoURL} alt={author.displayName} className="w-8 h-8 rounded-full flex-shrink-0 object-cover border-2 border-zinc-700" />
              ) : (
                <div className="w-8 h-8 rounded-full flex-shrink-0 bg-zinc-700 flex items-center justify-center">
                  <UserIcon size={14} className="text-zinc-400" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={(e) => { e.stopPropagation(); onReact?.('like'); }}
                className={\`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-colors duration-300 \${userReaction === 'like' ? 'bg-red-900/30 text-red-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-red-500'}\`}
              >
                <Heart size={14} className={(userReaction === "like") ? "fill-red-500 text-red-500" : "fill-transparent text-zinc-800 dark:text-zinc-300"} />
              </motion.button>
              {author && currentUserId && author.uid !== currentUserId && onFollowToggle && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFollowToggle(author.uid);
                  }}
                  className={cn("px-3 py-1 rounded-full text-[10px] font-bold transition-colors", 
                    author.followers?.includes(currentUserId) 
                    ? "bg-zinc-800 text-zinc-400" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  {author.followers?.includes(currentUserId) ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>`;

// 1. Remove old author section from flex-1 min-w-0
content = content.replace(/<div className="mt-3 flex items-center justify-between">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '</div>');

// 2. Add it to the flex flex-col gap-2 container
// Note: It's:
//       <div className="flex flex-col gap-2">
//         <button ...> <Download size={20} /> </button>
//         {isAdmin && ( ... )}
//       </div>
content = content.replace(
  /<div className="flex flex-col gap-2">([\s\S]*?\{isAdmin && \([\s\S]*?<\/div>\s*\)\})/,
  `<div className="flex flex-col gap-2 justify-between h-full items-end">
$1
${authorSectionHTML}`
);

// We need to make sure the PremiumCard root div has items-stretch instead of items-center so it takes full height.
content = content.replace(/className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex gap-4 items-center shadow-lg relative overflow-hidden"/, 'className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex gap-4 items-stretch shadow-lg relative overflow-hidden"');

fs.writeFileSync('src/App.tsx', content);
