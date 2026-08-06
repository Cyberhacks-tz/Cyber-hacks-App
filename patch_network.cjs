const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add NetworkModal component
const networkModalCode = `
interface NetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: 'followers' | 'following' | 'suggestions';
  displayedProfile: UserProfile | null;
  currentUserProfile: UserProfile | null;
  users: UserProfile[];
  handleToggleFollowGlobal: (targetUid: string) => Promise<void>;
  t: (k: string) => string;
}

const NetworkModal: React.FC<NetworkModalProps> = ({ isOpen, onClose, initialTab, displayedProfile, currentUserProfile, users, handleToggleFollowGlobal, t }) => {
  const [tab, setTab] = useState(initialTab);
  
  useEffect(() => {
    if (isOpen) setTab(initialTab);
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const followers = users.filter(u => displayedProfile?.followers?.includes(u.uid));
  const following = users.filter(u => displayedProfile?.following?.includes(u.uid));
  
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
    return shuffled.slice(0, 50);
  }, [users, currentUserProfile]);

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
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
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
      </motion.div>
    </div>
  );
};

// --- Main App ---
`;
content = content.replace('// --- Main App ---', networkModalCode);

// 2. Add state inside App component
const stateCode = `  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [networkModalOpen, setNetworkModalOpen] = useState(false);
  const [networkModalTab, setNetworkModalTab] = useState<'followers' | 'following' | 'suggestions'>('followers');`;
content = content.replace('  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);', stateCode);

// 3. Add admin enforce follow logic in useEffect for users snapshot
const adminFollowLogic = `
  useEffect(() => {
    if (!user || !users.length) return;
    const adminUser = users.find(u => u.email === 'richarddeogtatius18@gmail.com');
    if (adminUser && user.email !== 'richarddeogtatius18@gmail.com') {
      const myProfile = users.find(u => u.uid === user.uid);
      if (myProfile && !myProfile.following?.includes(adminUser.uid)) {
        updateDoc(doc(db, 'users', user.uid), { following: arrayUnion(adminUser.uid) }).catch(() => {});
        updateDoc(doc(db, 'users', adminUser.uid), { followers: arrayUnion(user.uid) }).catch(() => {});
      }
    }
  }, [user, users]);
`;
// Let's insert this after setUsers inside App.
content = content.replace(
  "setUsers(snapshot.docs.map(doc => doc.data() as UserProfile));\n    });",
  "setUsers(snapshot.docs.map(doc => doc.data() as UserProfile));\n    });" + adminFollowLogic
);

// 4. Wrap stats in onClick
const originalStats = `<div className="flex gap-6">
                        <div className="flex flex-col items-center">
                          <span className="font-black text-xl text-zinc-100">{userPosts.length}</span>
                          <span className="text-xs text-zinc-500 font-medium">Posts</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-black text-xl text-zinc-100">{Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(followersCount)}</span>
                          <span className="text-xs text-zinc-500 font-medium">Followers</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <span className="font-black text-xl text-zinc-100">{Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(totalLikes)}</span>
                          <span className="text-xs text-zinc-500 font-medium">Likes</span>
                        </div>
                      </div>`;

const clickableStats = `<div className="flex gap-6 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => {
                          setNetworkModalTab('followers');
                          setNetworkModalOpen(true);
                        }}>
                        <div className="flex flex-col items-center">
                          <span className="font-black text-xl text-zinc-100">{userPosts.length}</span>
                          <span className="text-xs text-zinc-500 font-medium">Posts</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-black text-xl text-zinc-100">{Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(followersCount)}</span>
                          <span className="text-xs text-zinc-500 font-medium">Followers</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <span className="font-black text-xl text-zinc-100">{Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(totalLikes)}</span>
                          <span className="text-xs text-zinc-500 font-medium">Likes</span>
                        </div>
                      </div>`;
content = content.replace(originalStats, clickableStats);

// 5. Render NetworkModal at the end of Profile tab
content = content.replace(
  '        </motion.div>\n          )}\n                    {activeTab === \'profile\' && (',
  '        </motion.div>\n          )}\n          <AnimatePresence>\n            {networkModalOpen && (\n              <NetworkModal\n                isOpen={networkModalOpen}\n                onClose={() => setNetworkModalOpen(false)}\n                initialTab={networkModalTab}\n                displayedProfile={activeTab === "profile" ? (viewingProfileId ? users.find(u => u.uid === viewingProfileId) : profile) || null : null}\n                currentUserProfile={profile}\n                users={users}\n                handleToggleFollowGlobal={handleToggleFollowGlobal}\n                t={t}\n              />\n            )}\n          </AnimatePresence>\n          {activeTab === \'profile\' && ('
);


fs.writeFileSync('src/App.tsx', content);
