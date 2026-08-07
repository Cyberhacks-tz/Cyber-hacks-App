const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const badgeComponent = `
const VerifiedBadge = ({ type, size = 14, className = "" }: { type?: '1' | '2', size?: number, className?: string }) => {
  if (type === '1') {
    return (
       <div className={\`flex items-center justify-center bg-blue-500 rounded-full flex-shrink-0 \${className}\`} style={{ width: size, height: size }}>
         <Check size={size * 0.7} className="text-white" strokeWidth={4} />
       </div>
    );
  }
  return <BadgeCheck size={size} className={\`text-blue-500 flex-shrink-0 \${className}\`} />;
};
`;

// Let's place it after the imports
content = content.replace("import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';", badgeComponent + "\nimport { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';");

// Now replace all occurrences of <BadgeCheck ... with <VerifiedBadge type={...} size={...} className={...}
// Wait, we need to pass type.
// {author?.verified && <BadgeCheck size={12} className="text-blue-500 ml-1 flex-shrink-0" />} -> <VerifiedBadge type={author?.verifiedType} size={12} className="ml-1" />
content = content.replace(/{author\?\.verified && <BadgeCheck size={12} className="text-blue-500 ml-1 flex-shrink-0" \/>}/g, '{author?.verified && <VerifiedBadge type={author?.verifiedType} size={12} className="ml-1" />}');
content = content.replace(/{author\?\.verified && <BadgeCheck size={14} className="text-blue-500 ml-1 flex-shrink-0" \/>}/g, '{author?.verified && <VerifiedBadge type={author?.verifiedType} size={14} className="ml-1" />}');

content = content.replace(/{u\.verified && <BadgeCheck size={14} className="text-blue-500" \/>}/g, '{u.verified && <VerifiedBadge type={u.verifiedType} size={14} />}');
content = content.replace(/{u\.verified && <BadgeCheck size={14} className="text-blue-500 flex-shrink-0" \/>}/g, '{u.verified && <VerifiedBadge type={u.verifiedType} size={14} />}');

content = content.replace(/{displayedProfile\?\.verified && <BadgeCheck size={18} className="text-blue-500" \/>}/g, '{displayedProfile?.verified && <VerifiedBadge type={displayedProfile?.verifiedType} size={18} />}');

content = content.replace(/{selectedUserForAction\.verified && <BadgeCheck size={16} className="text-blue-500" \/>}/g, '{selectedUserForAction.verified && <VerifiedBadge type={selectedUserForAction.verifiedType} size={16} />}');

fs.writeFileSync('src/App.tsx', content);
