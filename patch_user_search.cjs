const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const userSearchCode = `interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  currentUserProfile: UserProfile | null;
  handleToggleFollowGlobal: (targetUid: string) => Promise<void>;
  onUserSelect: (uid: string) => void;
  t: (k: string) => string;
}

const UserSearchModal: React.FC<UserSearchModalProps> = ({ isOpen, onClose, users, currentUserProfile, handleToggleFollowGlobal, onUserSelect, t }) => {
  const [query, setQuery] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return users.filter(u => u.displayName.toLowerCase().includes(query.toLowerCase()) || u.uid === query);
  }, [query, users]);

  const suggestions = useMemo(() => {
    if (!currentUserProfile) return [];
    let pot = users.filter(u => u.uid !== currentUserProfile.uid && !currentUserProfile.following?.includes(u.uid));
    const today = new Date().toDateString();
    let seed = 0;
    for(let i = 0; i < today.length; i++) seed += today.charCodeAt(i);
    const shuffled = [...pot].sort((a, b) => {
      const hashA = a.uid.charCodeAt(0) + seed;
      const hashB = b.uid.charCodeAt(0) + seed;
      return (hashA % 7) - (hashB % 7);
    });
    return shuffled.slice(0, 10); // 10 suggestions as requested
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
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="bg-zinc-900 border border-zinc-800 sm:rounded-2xl rounded-t-2xl w-full max-w-md h-[80vh] sm:h-[70vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-zinc-800 shrink-0 relative">
          <button onClick={onClose} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-zinc-800 rounded-full text-zinc-400">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-center font-bold text-zinc-100">Search Users</h2>
        </div>
        
        <div className="p-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text"
              placeholder="Search by username..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-zinc-800 text-zinc-100 pl-10 pr-4 py-3 rounded-xl outline-none border border-zinc-700 focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {query.trim() ? (
            <div className="space-y-1">
              {searchResults.length > 0 ? searchResults.map(renderUser) : (
                <div className="text-center text-zinc-500 py-8">No users found</div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="px-3 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 mt-2">Suggestions</h3>
              <div className="space-y-1">
                {suggestions.map(renderUser)}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

`;

content = content.replace('interface NetworkModalProps {', userSearchCode + 'interface NetworkModalProps {');

fs.writeFileSync('src/App.tsx', content);
