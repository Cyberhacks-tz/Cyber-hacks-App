const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const promptTopLeftOld = `{prompt.image ? (
        <img 
          src={prompt.image}`;

const promptTopLeftNew = `{prompt.image ? (
        <img 
          src={prompt.image}`;

const promptAuthorOld = `      {(isAdmin || canEdit) && (
        <div className="absolute top-3 right-3 flex gap-2 z-20" onClick={e => e.stopPropagation()}>`;

const promptAuthorNew = `      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10" onClick={(e) => {
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
      </div>

      {(isAdmin || canEdit) && (
        <div className="absolute top-3 right-3 flex gap-2 z-20" onClick={e => e.stopPropagation()}>`;

content = content.replace(promptAuthorOld, promptAuthorNew);

fs.writeFileSync('src/App.tsx', content);
