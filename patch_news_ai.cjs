const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. NewsCard author block replacement
const newsOldAuthor = `<div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10" onClick={(e) => {
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
          <span className="text-[10px] font-medium text-zinc-200 hover:underline truncate">{author?.displayName || 'User'}</span>
          {author?.verified && <BadgeCheck size={10} className="text-blue-500 ml-1 flex-shrink-0" />}
        </div>
        {author && currentUserId && author.uid !== currentUserId && onFollowToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFollowToggle(author.uid);
            }}
            className={cn("px-2 py-0.5 ml-1 rounded-full text-[9px] font-bold transition-colors", 
              author.followers?.includes(currentUserId) 
              ? "bg-white/20 text-zinc-300" 
              : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {author.followers?.includes(currentUserId) ? 'Following' : 'Follow'}
          </button>
        )}
      </div>`;

const newAuthorHTML = (isAiPrompt) => `<div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg" onClick={(e) => {
        if(onAuthorClick) { e.stopPropagation(); onAuthorClick(); }
      }}>
        {author?.photoURL ? (
          <img src={author.photoURL} alt={author.displayName} className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-zinc-600" />
        ) : (
          <div className="w-8 h-8 rounded-full flex-shrink-0 bg-zinc-700 flex items-center justify-center border border-zinc-600">
            <UserIcon size={14} className="text-zinc-400" />
          </div>
        )}
        <div className="flex items-center min-w-0 mr-1">
          <span className="text-xs font-bold text-zinc-100 hover:underline truncate">{author?.displayName || 'User'}</span>
          {author?.verified && <BadgeCheck size={14} className="text-blue-500 ml-1 flex-shrink-0" />}
        </div>
        {author && currentUserId && author.uid !== currentUserId && onFollowToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFollowToggle(author.uid);
            }}
            className={cn("px-3 py-1 ml-1 rounded-full text-[10px] font-bold transition-colors shadow-sm", 
              author.followers?.includes(currentUserId) 
              ? "bg-white/20 text-zinc-100 hover:bg-white/30" 
              : "bg-blue-600 text-white hover:bg-blue-500"
            )}
          >
            {author.followers?.includes(currentUserId) ? 'Following' : 'Follow'}
          </button>
        )}
      </div>`;

content = content.replace(newsOldAuthor, newAuthorHTML(false));

// 2. AiPromptCard author block replacement
const aiOldAuthor = `<div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10" onClick={(e) => {
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
          <span className="text-[10px] font-medium text-zinc-200 hover:underline truncate">{author?.displayName || 'User'}</span>
          {author?.verified && <BadgeCheck size={10} className="text-blue-500 ml-1 flex-shrink-0" />}
        </div>
        {author && currentUserId && author.uid !== currentUserId && onFollowToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFollowToggle(author.uid);
            }}
            className={cn("px-2 py-0.5 ml-1 rounded-full text-[9px] font-bold transition-colors", 
              author.followers?.includes(currentUserId) 
              ? "bg-white/20 text-zinc-300" 
              : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {author.followers?.includes(currentUserId) ? 'Following' : 'Follow'}
          </button>
        )}
      </div>`;

content = content.replace(aiOldAuthor, newAuthorHTML(true));

fs.writeFileSync('src/App.tsx', content);
