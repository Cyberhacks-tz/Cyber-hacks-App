const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update PremiumCardProps
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

// Update PremiumCard signature and add author section at bottom of flex-1
code = code.replace(/const PremiumCard: React.FC<PremiumCardProps> = \(\{ app, onDownload, isAdmin, onDelete, onEdit, t, index = 0 \}\) => \{/, 
  `const PremiumCard: React.FC<PremiumCardProps> = ({ app, onDownload, isAdmin, canEdit, onDelete, onEdit, t, index = 0, author, onAuthorClick, reactions, userReaction, onReact }) => {`);

// Update PremiumCard Action Buttons
code = code.replace(/\{isAdmin && \([\s]*<div className="flex flex-col gap-2 shrink-0">/, `{(isAdmin || canEdit) && (
          <div className="flex flex-col gap-2 shrink-0">`);

// Actually it seems I need to parse the existing PremiumCard return. Let's do a more robust replacement by replacing the whole function body or just injecting.

