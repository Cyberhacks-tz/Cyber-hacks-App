const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. PremiumCardProps
code = code.replace(/interface PremiumCardProps \{[\s\S]*?(?=const PremiumCard: React.FC)/, `interface PremiumCardProps {
  app: PremiumApp;
  isPremium: boolean;
  onDownload: () => void;
  isAdmin?: boolean;
  canEdit?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  t: (k: string) => string;
  index?: number;
  author?: UserProfile;
  onAuthorClick?: () => void;
  reactions?: { like?: number };
  userReaction?: 'like' | null;
  onReact?: (type: 'like') => void;
}
`);
code = code.replace(/const PremiumCard: React.FC<PremiumCardProps> = \(\{ app, onDownload, isAdmin, onDelete, onEdit, t, index = 0 \}\) => \{/,
`const PremiumCard: React.FC<PremiumCardProps> = ({ app, onDownload, isAdmin, canEdit, onDelete, onEdit, t, index = 0, author, onAuthorClick, reactions, userReaction, onReact }) => {`);

// PremiumCard Admin Buttons
code = code.replace(/\{isAdmin && app.password && \(/g, "{(isAdmin || canEdit) && app.password && (");
code = code.replace(/\{isAdmin && \(\s*<div className="flex flex-col gap-2 shrink-0">/, 
`{(isAdmin || canEdit) && (
          <div className="flex flex-col gap-2 shrink-0">`);

// PremiumCard Author + Like injection
// We'll insert it right after the password display in PremiumCard
const premiumAuthorSnippet = `
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => {
            if(onAuthorClick) { e.stopPropagation(); onAuthorClick(); }
          }}>
            {author?.photoURL ? (
              <img src={author.photoURL} alt={author.displayName} className="w-5 h-5 rounded-full object-cover border border-zinc-700" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center">
                <UserIcon size={10} className="text-zinc-400" />
              </div>
            )}
            <span className="text-[10px] font-medium text-zinc-400 hover:underline">{author?.displayName || 'User'}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onReact?.('like'); }}
            className={\`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full transition-colors \${userReaction === 'like' ? 'bg-red-900/30 text-red-500' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}\`}
          >
            <span>♥️</span>
            <span className="font-medium">{reactions?.like || 0}</span>
          </button>
        </div>
`;
code = code.replace(/<\/div>\s*<div className="flex flex-col gap-2">/, premiumAuthorSnippet + `      </div>\n      <div className="flex flex-col gap-2">`);


// 2. AiPromptCardProps
code = code.replace(/interface AiPromptCardProps \{[\s\S]*?(?=const AiPromptCard: React.FC)/, `interface AiPromptCardProps {
  prompt: AiPrompt;
  isAdmin?: boolean;
  canEdit?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onClick: () => void;
  index?: number;
  author?: UserProfile;
  onAuthorClick?: () => void;
  reactions?: { like?: number };
  userReaction?: 'like' | null;
  onReact?: (type: 'like') => void;
}
`);
code = code.replace(/const AiPromptCard: React.FC<AiPromptCardProps> = \(\{ prompt, isAdmin, onDelete, onEdit, onClick, index = 0 \}\) => \{/,
`const AiPromptCard: React.FC<AiPromptCardProps> = ({ prompt, isAdmin, canEdit, onDelete, onEdit, onClick, index = 0, author, onAuthorClick, reactions, userReaction, onReact }) => {`);

code = code.replace(/\{isAdmin && \(\s*<div className="absolute top-3 right-3 flex gap-2 z-20"/, 
`{(isAdmin || canEdit) && (
        <div className="absolute top-3 right-3 flex gap-2 z-20"`);

// AiPromptCard Author + Like injection
// We'll insert it at the top-left of the card.
const aiAuthorSnippet = `
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full pr-3 p-1">
        <div className="cursor-pointer" onClick={(e) => {
            if(onAuthorClick) { e.stopPropagation(); onAuthorClick(); }
          }}>
          {author?.photoURL ? (
            <img src={author.photoURL} alt={author.displayName} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center">
              <UserIcon size={12} className="text-zinc-400" />
            </div>
          )}
        </div>
        <span className="text-[10px] font-medium text-zinc-300 truncate max-w-[80px]" onClick={(e) => {
            if(onAuthorClick) { e.stopPropagation(); onAuthorClick(); }
          }}>{author?.displayName || 'User'}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onReact?.('like'); }}
          className={\`flex items-center gap-1 text-[10px] ml-1 \${userReaction === 'like' ? 'text-red-500' : 'text-zinc-400 hover:text-white'}\`}
        >
          <span>♥️</span>
          <span className="font-medium">{reactions?.like || 0}</span>
        </button>
      </div>
`;
code = code.replace(/className="relative rounded-\[2.5rem\] overflow-hidden[^>]*>\s*\{prompt\.image \? \(/, function(match) {
  return match.split('{prompt.image ? (')[0] + aiAuthorSnippet + '\n      {prompt.image ? (';
});

// 3. NewsCardProps
code = code.replace(/interface NewsCardProps \{[\s\S]*?(?=const NewsCard: React.FC)/, `interface NewsCardProps {
  news: CyberNews;
  isAdmin?: boolean;
  canEdit?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onClick: () => void;
  t: (k: string) => string;
  index?: number;
  author?: UserProfile;
  onAuthorClick?: () => void;
  reactions?: { like?: number };
  userReaction?: 'like' | null;
  onReact?: (type: 'like') => void;
}
`);
code = code.replace(/const NewsCard: React.FC<NewsCardProps> = \(\{ news, isAdmin, onDelete, onEdit, onClick, t, index = 0 \}\) => \{/,
`const NewsCard: React.FC<NewsCardProps> = ({ news, isAdmin, canEdit, onDelete, onEdit, onClick, t, index = 0, author, onAuthorClick, reactions, userReaction, onReact }) => {`);

code = code.replace(/\{isAdmin && \(\s*<div className="absolute top-3 right-3 z-10 flex gap-2">/, 
`{(isAdmin || canEdit) && (
        <div className="absolute top-3 right-3 z-10 flex gap-2">`);

const newsAuthorSnippet = `
        <div className="mt-3 flex items-center justify-between border-t border-zinc-700/50 pt-2">
          <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => {
            if(onAuthorClick) { e.stopPropagation(); onAuthorClick(); }
          }}>
            {author?.photoURL ? (
              <img src={author.photoURL} alt={author.displayName} className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center">
                <UserIcon size={10} className="text-zinc-400" />
              </div>
            )}
            <span className="text-[10px] font-medium text-zinc-300 hover:underline">{author?.displayName || 'User'}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onReact?.('like'); }}
            className={\`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full transition-colors \${userReaction === 'like' ? 'bg-red-900/30 text-red-500' : 'bg-black/40 text-zinc-400 hover:bg-black/60'}\`}
          >
            <span>♥️</span>
            <span className="font-medium">{reactions?.like || 0}</span>
          </button>
        </div>
`;
code = code.replace(/<span className="text-green-400 text-xs font-bold mt-2 block">\{t\('seeMore'\)\}<\/span>\s*<\/div>/,
`<span className="text-green-400 text-xs font-bold mt-2 block">{t('seeMore')}</span>\n${newsAuthorSnippet}\n      </div>`);


fs.writeFileSync('src/App.tsx', code);
