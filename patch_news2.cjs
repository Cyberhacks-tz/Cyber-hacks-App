const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const newsOldBlock = `<div className="flex items-center gap-2 cursor-pointer flex-1 min-w-0" onClick={(e) => {
            if(onAuthorClick) { e.stopPropagation(); onAuthorClick(); }
          }}>
            {author?.photoURL ? (
              <img src={author.photoURL} alt={author.displayName} className="w-5 h-5 rounded-full flex-shrink-0 object-cover" />
            ) : (
              <div className="w-5 h-5 rounded-full flex-shrink-0 bg-zinc-700 flex items-center justify-center">
                <UserIcon size={10} className="text-zinc-400" />
              </div>
            )}
            <div className="flex items-center min-w-0">
              <span className="text-[10px] font-medium text-zinc-300 hover:underline truncate">{author?.displayName || 'User'}</span>
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
                  ? "bg-black/40 text-zinc-400" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                {author.followers?.includes(currentUserId) ? 'Following' : 'Follow'}
              </button>
            )}`;

const newsNewBlock = `<div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0" onClick={(e) => {
            if(onAuthorClick) { e.stopPropagation(); onAuthorClick(); }
          }}>
            {author?.photoURL ? (
              <img src={author.photoURL} alt={author.displayName} className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-zinc-700" />
            ) : (
              <div className="w-8 h-8 rounded-full flex-shrink-0 bg-zinc-700 flex items-center justify-center">
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
                  ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" 
                  : "bg-blue-600 text-white hover:bg-blue-500"
                )}
              >
                {author.followers?.includes(currentUserId) ? 'Following' : 'Follow'}
              </button>
            )}`;

content = content.replace(newsOldBlock, newsNewBlock);
fs.writeFileSync('src/App.tsx', content);
