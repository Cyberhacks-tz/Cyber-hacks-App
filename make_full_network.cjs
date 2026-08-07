const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldModal = `const NetworkModal: React.FC<NetworkModalProps> = ({ isOpen, onClose, initialTab, displayedProfile, currentUserProfile, users, handleToggleFollowGlobal, t }) => {
  const [tab, setTab] = useState(initialTab);
  
  useEffect(() => {
    if (isOpen) setTab(initialTab);
  }, [isOpen, initialTab]);

  const followers = users.filter(u => displayedProfile?.followers?.includes(u.uid));
  const following = users.filter(u => displayedProfile?.following?.includes(u.uid));
  
  const suggestions = useMemo(() => {
    if (!currentUserProfile) return [];
    let pot = users.filter(u => u.uid !== currentUserProfile.uid && !currentUserProfile.following?.includes(u.uid));
    const today = new Date().toDateString();
    let seed = 0;
    for(let i = 0; i < today.length; i++) seed += today.charCodeAt(i);
    const shuffled = [...pot].sort((a, b) => {
      const hashA = (a.uid || "a").charCodeAt(0) + seed;
      const hashB = (b.uid || "b").charCodeAt(0) + seed;
      return (hashA % 7) - (hashB % 7);
    });
    return shuffled.slice(0, 50);
  }, [users, currentUserProfile]);

  if (!isOpen) return null;

  const renderUser = (u: UserProfile) => {
    const isCurrentUser = currentUserProfile?.uid === u.uid;
    const isFollowing = currentUserProfile?.following?.includes(u.uid);
    const followsMe = currentUserProfile?.followers?.includes(u.uid);
    
    let btnText = 'Follow';
    if (isFollowing && followsMe) btnText = 'Friend';
    else if (isFollowing) btnText = 'Following';
    else if (followsMe) btnText = 'Follow back';

    return (
      <div key={u.uid} className="flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded-xl transition-colors">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src={u.photoURL} alt={u.displayName} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="font-bold text-sm text-zinc-100 flex items-center gap-1">
              {u.displayName}
              {u.verified && <BadgeCheck size={14} className="text-blue-500" />}
            </span>
          </div>
        </div>
        {!isCurrentUser && (
           <button 
             onClick={() => handleToggleFollowGlobal(u.uid)}
             className={\`px-4 py-1.5 rounded-full text-xs font-bold transition-colors \${
               isFollowing ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-blue-600 text-white hover:bg-blue-700'
             }\`}
           >
             {btnText}
           </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex border-b border-zinc-800 shrink-0">
          <button onClick={() => setTab('followers')} className={\`flex-1 py-3 text-sm font-bold \${tab === 'followers' ? 'text-white border-b-2 border-white' : 'text-zinc-500'}\`}>Followers</button>
          <button onClick={() => setTab('following')} className={\`flex-1 py-3 text-sm font-bold \${tab === 'following' ? 'text-white border-b-2 border-white' : 'text-zinc-500'}\`}>Following</button>
          <button onClick={() => setTab('suggestions')} className={\`flex-1 py-3 text-sm font-bold \${tab === 'suggestions' ? 'text-white border-b-2 border-white' : 'text-zinc-500'}\`}>Suggestions</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {tab === 'followers' && followers.map(renderUser)}
          {tab === 'following' && following.map(renderUser)}
          {tab === 'suggestions' && suggestions.map(renderUser)}
          
          {tab === 'followers' && followers.length === 0 && <div className="text-center text-zinc-500 py-8">No followers yet</div>}
          {tab === 'following' && following.length === 0 && <div className="text-center text-zinc-500 py-8">Not following anyone</div>}
          {tab === 'suggestions' && suggestions.length === 0 && <div className="text-center text-zinc-500 py-8">No suggestions available</div>}
        </div>
      </div>
    </div>
  );
};`;

const newModal = `const NetworkModal: React.FC<NetworkModalProps> = ({ isOpen, onClose, initialTab, displayedProfile, currentUserProfile, users, handleToggleFollowGlobal, t }) => {
  const [tab, setTab] = useState(initialTab);
  
  useEffect(() => {
    if (isOpen) setTab(initialTab);
  }, [isOpen, initialTab]);

  const followers = users.filter(u => displayedProfile?.followers?.includes(u.uid));
  const following = users.filter(u => displayedProfile?.following?.includes(u.uid));
  
  const suggestions = useMemo(() => {
    if (!currentUserProfile) return [];
    let pot = users.filter(u => u.uid !== currentUserProfile.uid && !currentUserProfile.following?.includes(u.uid));
    const today = new Date().toDateString();
    let seed = 0;
    for(let i = 0; i < today.length; i++) seed += today.charCodeAt(i);
    const shuffled = [...pot].sort((a, b) => {
      const hashA = (a.uid || "a").charCodeAt(0) + seed;
      const hashB = (b.uid || "b").charCodeAt(0) + seed;
      return (hashA % 7) - (hashB % 7);
    });
    return shuffled.slice(0, 50);
  }, [users, currentUserProfile]);

  if (!isOpen) return null;

  const renderUser = (u: UserProfile) => {
    const isCurrentUser = currentUserProfile?.uid === u.uid;
    const isFollowing = currentUserProfile?.following?.includes(u.uid);
    const followsMe = currentUserProfile?.followers?.includes(u.uid);
    
    let btnText = 'Follow';
    if (isFollowing && followsMe) btnText = 'Friend';
    else if (isFollowing) btnText = 'Following';
    else if (followsMe) btnText = 'Follow back';

    return (
      <div key={u.uid} className="flex items-center justify-between p-3 hover:bg-zinc-800/50 rounded-xl transition-colors bg-zinc-900/40 mb-2 border border-zinc-800/50">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src={u.photoURL || ''} alt={u.displayName} className="w-12 h-12 rounded-full object-cover border border-zinc-700" />
          <div className="flex flex-col">
            <span className="font-bold text-zinc-100 flex items-center gap-1">
              {u.displayName}
              {u.verified && <BadgeCheck size={14} className="text-blue-500" />}
            </span>
          </div>
        </div>
        {!isCurrentUser && (
           <button 
             onClick={() => handleToggleFollowGlobal(u.uid)}
             className={\`px-5 py-1.5 rounded-full text-xs font-bold transition-colors \${
               isFollowing ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-blue-600 text-white hover:bg-blue-700'
             }\`}
           >
             {btnText}
           </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-zinc-800 bg-zinc-950">
        <button onClick={onClose} className="mr-4 p-2 -ml-2 rounded-full hover:bg-zinc-800 transition-colors">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <div className="flex flex-col">
           <span className="font-bold text-lg text-white leading-tight">{displayedProfile?.displayName || 'Network'}</span>
           <span className="text-xs text-zinc-500">{displayedProfile?.email}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 shrink-0 bg-zinc-950">
        <button onClick={() => setTab('followers')} className={\`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors \${tab === 'followers' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'}\`}>Followers</button>
        <button onClick={() => setTab('following')} className={\`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors \${tab === 'following' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'}\`}>Following</button>
        <button onClick={() => setTab('suggestions')} className={\`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors \${tab === 'suggestions' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'}\`}>Suggestions</button>
      </div>
      
      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 bg-black">
        <div className="max-w-xl mx-auto">
          {tab === 'followers' && followers.map(renderUser)}
          {tab === 'following' && following.map(renderUser)}
          {tab === 'suggestions' && suggestions.map(renderUser)}
          
          {tab === 'followers' && followers.length === 0 && <div className="text-center text-zinc-500 py-12 font-medium">No followers yet</div>}
          {tab === 'following' && following.length === 0 && <div className="text-center text-zinc-500 py-12 font-medium">Not following anyone</div>}
          {tab === 'suggestions' && suggestions.length === 0 && <div className="text-center text-zinc-500 py-12 font-medium">No suggestions available</div>}
        </div>
      </div>
    </div>
  );
};`;

if (content.includes(oldModal)) {
    content = content.replace(oldModal, newModal);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Successfully replaced NetworkModal.");
} else {
    console.log("Could not find NetworkModal to replace. Lengths:", oldModal.length);
}
