const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldRenderUser = `  const renderUser = (u: UserProfile) => {
    const isCurrentUser = currentUserProfile?.uid === u.uid;
    const isFollowing = currentUserProfile?.following?.includes(u.uid);
    const followsMe = currentUserProfile?.followers?.includes(u.uid);
    
    let btnText = 'Follow';
    if (isFollowing && followsMe) btnText = 'Friend';
    else if (isFollowing) btnText = 'Following';
    else if (followsMe) btnText = 'Follow back';

    return (
      <div key={u.uid} className="flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded-xl transition-colors">
        <div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0" onClick={() => onUserSelect(u.uid)}>
          <img src={u.photoURL || ''} alt={u.displayName} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-zinc-100 flex items-center gap-1 truncate">
              {u.displayName}
              {u.verified && <BadgeCheck size={14} className="text-blue-500 flex-shrink-0" />}
            </span>
          </div>
        </div>
        {!isCurrentUser && (
           <button
             onClick={(e) => { e.stopPropagation(); handleToggleFollowGlobal(u.uid); }}
             className={\`px-4 py-1.5 rounded-full text-[10px] font-bold transition-colors ml-2 \${
               isFollowing ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-blue-600 text-white hover:bg-blue-700'
             }\`}
           >
             {btnText}
           </button>
        )}
      </div>
    );
  };`;

const newRenderUser = `  const renderUser = (u: UserProfile, index: number) => {
    const isCurrentUser = currentUserProfile?.uid === u.uid;
    const isFollowing = currentUserProfile?.following?.includes(u.uid);
    const followsMe = currentUserProfile?.followers?.includes(u.uid);
    
    let btnText = 'Follow';
    if (isFollowing && followsMe) btnText = 'Friend';
    else if (isFollowing) btnText = 'Following';
    else if (followsMe) btnText = 'Follow back';

    return (
      <motion.div 
        key={u.uid} 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        className="flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded-xl transition-colors"
      >
        <div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0" onClick={() => onUserSelect(u.uid)}>
          <img src={u.photoURL || ''} alt={u.displayName} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-zinc-100 flex items-center gap-1 truncate">
              {u.displayName}
              {u.verified && <BadgeCheck size={14} className="text-blue-500 flex-shrink-0" />}
            </span>
          </div>
        </div>
        {!isCurrentUser && (
           <button
             onClick={(e) => { e.stopPropagation(); handleToggleFollowGlobal(u.uid); }}
             className={\`px-4 py-1.5 rounded-full text-[10px] font-bold transition-colors ml-2 \${
               isFollowing ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-blue-600 text-white hover:bg-blue-700'
             }\`}
           >
             {btnText}
           </button>
        )}
      </motion.div>
    );
  };`;

content = content.replace(oldRenderUser, newRenderUser);
fs.writeFileSync('src/App.tsx', content);
