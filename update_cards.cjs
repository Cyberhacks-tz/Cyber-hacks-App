const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update React function signature in App.tsx
code = code.replace(/handleReact = async \(postId: string, type: 'laugh' \| 'think' \| 'angry'\)/g, "handleReact = async (postId: string, type: 'like')");
code = code.replace(/type: 'laugh' \| 'think' \| 'angry'/g, "type: 'like'");

// 2. Replace Card component definitions
const cardRegex = /interface CardProps \{[\s\S]*?(?=interface PremiumCardProps \{)/;
code = code.replace(cardRegex, `interface CardProps {
  title: string;
  image: string;
  link?: string;
  onClick?: () => void;
  isAdmin?: boolean;
  canEdit?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  reactions?: { like?: number };
  userReaction?: 'like' | null;
  onReact?: (type: 'like') => void;
  createdAt?: any;
  password?: string;
  passwordRequestMsg?: string;
  t: (k: string) => string;
  index?: number;
  author?: UserProfile;
  onAuthorClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, image, link, onClick, isAdmin, canEdit, onDelete, onEdit, reactions, userReaction, onReact, createdAt, password, passwordRequestMsg, t, index = 0, author, onAuthorClick }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [fakeLikes, setFakeLikes] = useState(0);

  useEffect(() => {
    if (isAdmin || !createdAt) return;
    const calculateOffsets = () => {
      const now = Date.now();
      const createdTime = createdAt?.toMillis ? createdAt.toMillis() : new Date(createdAt).getTime();
      if (isNaN(createdTime)) return;
      const hoursElapsed = (now - createdTime) / (1000 * 60 * 60);
      setFakeLikes(Math.floor(hoursElapsed * 1.5) + 5);
    };
    calculateOffsets();
    const interval = setInterval(calculateOffsets, 60000);
    return () => clearInterval(interval);
  }, [isAdmin, createdAt]);

  const displayLikes = isAdmin ? (reactions?.like || 0) : ((reactions?.like || 0) + fakeLikes);
  const isLiked = userReaction === 'like';

  const handleOpen = async () => {
    if (password && password.trim() !== '' && !isAdmin) {
      setShowPasswordPrompt(true);
      return;
    }
    if (onClick) {
      onClick();
      return;
    }
    if (link) {
      setIsOpening(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      handleExternalLink(link);
      setIsOpening(false);
    }
  };

  const executeOpen = async () => {
    if (onClick) {
      onClick();
      return;
    }
    if (link) {
      setIsOpening(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      handleExternalLink(link);
      setIsOpening(false);
    }
  };

  return (
    <>
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl group cursor-pointer relative flex flex-col transition-colors"
      onClick={handleOpen}
    >
      {isOpening && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
          />
          <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest animate-pulse">Connecting...</span>
        </div>
      )}
      {(isAdmin || canEdit) && (
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        {password && isAdmin && (
          <div className="px-2 py-1 bg-black/80 text-green-400 rounded text-[10px] font-mono flex items-center gap-1">
            <Key size={10} /> {password}
          </div>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="p-2 bg-gradient-to-r from-green-600 to-purple-600/80 text-white rounded-full hover:bg-green-600 transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    )}
    <div className="p-3">
      <h3 className="text-sm font-semibold dark:text-zinc-100 text-zinc-100 truncate">
        {title} {password && password.trim() !== '' && <span className="ml-1" title="Premium">👑</span>}
      </h3>
    </div>
    <div className="aspect-square relative overflow-hidden">
      {image ? (
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
          <Globe size={32} className="text-zinc-700" />
        </div>
      )}
    </div>
    
    <div className="p-3 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50">
      <div className="flex items-center gap-2" onClick={(e) => {
        if(onAuthorClick) { e.stopPropagation(); onAuthorClick(); }
      }}>
        {author?.photoURL ? (
          <img src={author.photoURL} alt={author.displayName} className="w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-zinc-700" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
            <UserIcon size={12} className="text-zinc-500 dark:text-zinc-400" />
          </div>
        )}
        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:underline">{author?.displayName || 'User'}</span>
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onReact?.('like');
        }}
        className={cn(
          "flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors",
          isLiked ? "bg-red-100 dark:bg-red-900/30 text-red-500" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
        )}
      >
        <span>♥️</span>
        <span className="font-medium">{displayLikes}</span>
      </button>
    </div>
  </motion.div>
  <PasswordModal 
    isOpen={showPasswordPrompt}
    onClose={() => setShowPasswordPrompt(false)}
    onSuccess={executeOpen}
    expectedPassword={password}
    requestMessage={passwordRequestMsg}
    t={t}
  />
  </>);
};

`);

fs.writeFileSync('src/App.tsx', code);
