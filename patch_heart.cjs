const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// For Card: it has isLiked variable
content = content.replace(
  /<span>♥️<\/span>\s*<span className="font-medium">\{displayLikes\}<\/span>/g,
  '<Heart size={12} className={isLiked ? "fill-red-500 text-red-500" : "fill-black text-black dark:fill-zinc-400 dark:text-zinc-400"} />\n        <span className="font-medium">{displayLikes}</span>'
);

// Also sometimes it's just <span>♥️</span> without displayLikes if we removed displayLikes ?
// Let's just do a global replace for all remaining <span>♥️</span> (but we need to know if it's isLiked or userReaction === 'like')
content = content.replace(
  /<span>♥️<\/span>/g,
  '<Heart size={12} className={(typeof isLiked !== "undefined" ? isLiked : userReaction === "like") ? "fill-red-500 text-red-500" : "fill-black text-black"} />'
);

fs.writeFileSync('src/App.tsx', content);
