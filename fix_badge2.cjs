const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(/<BadgeCheck size=\{12\} className="text-blue-500 ml-1 flex-shrink-0" \/>/g, '<VerifiedBadge type={author?.verifiedType} size={12} className="ml-1" />');
content = content.replace(/<BadgeCheck size=\{14\} className="text-blue-500 ml-1 flex-shrink-0" \/>/g, '<VerifiedBadge type={author?.verifiedType} size={14} className="ml-1" />');

content = content.replace(/{u\.verified && <BadgeCheck size=\{14\} className="text-blue-500" \/>}/g, '{u.verified && <VerifiedBadge type={u.verifiedType} size={14} />}');
content = content.replace(/{u\.verified && <BadgeCheck size=\{14\} className="text-blue-500 flex-shrink-0" \/>}/g, '{u.verified && <VerifiedBadge type={u.verifiedType} size={14} />}');

content = content.replace(/{displayedProfile\?\.verified && <BadgeCheck size=\{18\} className="text-blue-500" \/>}/g, '{displayedProfile?.verified && <VerifiedBadge type={displayedProfile?.verifiedType} size={18} />}');
content = content.replace(/{selectedUserForAction\.verified && <BadgeCheck size=\{16\} className="text-blue-500" \/>}/g, '{selectedUserForAction.verified && <VerifiedBadge type={selectedUserForAction.verifiedType} size={16} />}');

fs.writeFileSync('src/App.tsx', content);
