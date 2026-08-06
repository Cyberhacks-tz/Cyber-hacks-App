const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const followButtonHTML = `      <div className="absolute bottom-2 right-2 z-10 flex gap-2">
        {author && currentUserId && author.uid !== currentUserId && onFollowToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFollowToggle(author.uid);
            }}
            className={cn("px-3 py-1 rounded-full text-[10px] font-bold transition-colors shadow-lg backdrop-blur-md border border-white/10", 
              author.followers?.includes(currentUserId) 
              ? "bg-black/50 text-white hover:bg-black/70" 
              : "bg-blue-600/90 text-white hover:bg-blue-600"
            )}
          >
            {author.followers?.includes(currentUserId) ? 'Following' : 'Follow'}
          </button>
        )}
      </div>`;

content = content.replace(
  /(\s*)\}\s*<\/div>\s*<div className="p-3 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800\/50">/,
  `$1}
${followButtonHTML}
    </div>
    <div className="p-3 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50">`
);

fs.writeFileSync('src/App.tsx', content);
