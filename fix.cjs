const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Remove fakeLikes from Card
content = content.replace(/const \[fakeLikes, setFakeLikes\] = useState\(0\);\s*useEffect\(\(\) => \{[\s\S]*?\}, \[isAdmin, createdAt\]\);\s*const displayLikes = isAdmin \? \(reactions\?\.like \|\| 0\) : \(\(reactions\?\.like \|\| 0\) \+ fakeLikes\);/, '');

// 2. Update Card like button
content = content.replace(
  /<button\s+onClick=\{\(e\) => \{\s+e\.stopPropagation\(\);\s+onReact\?\.\('like'\);\s+\}\}\s+className=\{cn\(\s+"flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors",\s+isLiked \? "bg-red-100 dark:bg-red-900\/30 text-red-500" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"\s+\)\}\s+>\s+<span>♥️<\/span>\s+<span className="font-medium">\{displayLikes\}<\/span>\s+<\/button>/g,
  `<motion.button
        whileTap={{ scale: 0.8 }}
        onClick={(e) => {
          e.stopPropagation();
          onReact?.('like');
        }}
        className={cn(
          "flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors duration-300",
          isLiked ? "bg-red-100 dark:bg-red-900/30 text-red-500" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-red-500"
        )}
      >
        <span>♥️</span>
      </motion.button>`
);

// 3. Update PremiumCard like button
content = content.replace(
  /<button\s+onClick=\{\(e\) => \{ e\.stopPropagation\(\); onReact\?\.\('like'\); \}\}\s+className=\{`flex items-center gap-1 text-\[10px\] px-2 py-1 rounded-full transition-colors \$\{userReaction === 'like' \? 'bg-red-900\/30 text-red-500' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'\}`\}\s+>\s+<span>♥️<\/span>\s+<span className="font-medium">\{reactions\?\.like \|\| 0\}<\/span>\s+<\/button>/g,
  `<motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onReact?.('like'); }}
            className={\`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full transition-colors duration-300 \${userReaction === 'like' ? 'bg-red-900/30 text-red-500' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-red-500'}\`}
          >
            <span>♥️</span>
          </motion.button>`
);

// 4. Update NewsCard like button
content = content.replace(
  /<button\s+onClick=\{\(e\) => \{ e\.stopPropagation\(\); onReact\?\.\('like'\); \}\}\s+className=\{`flex items-center gap-1 text-\[10px\] px-2 py-1 rounded-full transition-colors \$\{userReaction === 'like' \? 'bg-red-900\/30 text-red-500' : 'bg-black\/40 text-zinc-400 hover:bg-black\/60'\}`\}\s+>\s+<span>♥️<\/span>\s+<span className="font-medium">\{reactions\?\.like \|\| 0\}<\/span>\s+<\/button>/g,
  `<motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onReact?.('like'); }}
            className={\`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full transition-colors duration-300 \${userReaction === 'like' ? 'bg-red-900/30 text-red-500' : 'bg-black/40 text-zinc-400 hover:bg-black/60 hover:text-red-500'}\`}
          >
            <span>♥️</span>
          </motion.button>`
);

// 5. Remove fakeLikes from profile totalLikes
content = content.replace(
  /const totalLikes = userPosts\.reduce\(\(acc, post\) => \{\s*let fakeLikes = 0;\s*if \(!isAdmin && post\.createdAt\) \{\s*const now = Date\.now\(\);\s*const createdTime = post\.createdAt\?\.toMillis \? post\.createdAt\.toMillis\(\) : new Date\(post\.createdAt\)\.getTime\(\);\s*if \(!isNaN\(createdTime\)\) \{\s*const hoursElapsed = \(now - createdTime\) \/ \(1000 \* 60 \* 60\);\s*fakeLikes = Math\.floor\(hoursElapsed \* 1\.5\) \+ 5;\s*\}\s*\}\s*return acc \+ \(post\.reactions\?\.like \|\| 0\) \+ fakeLikes;\s*\}, 0\);/g,
  `const totalLikes = userPosts.reduce((acc, post) => {
                  return acc + (post.reactions?.like || 0);
                }, 0);`
);

// 6. Format numbers in profile
// Replace {followersCount} and {totalLikes} with formatted versions
const formatStr = `Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format`;
content = content.replace(
  /<span className="font-black text-xl text-zinc-100">\{followersCount\}<\/span>/g,
  `<span className="font-black text-xl text-zinc-100">{${formatStr}(followersCount)}</span>`
);
content = content.replace(
  /<span className="font-black text-xl text-zinc-100">\{totalLikes\}<\/span>/g,
  `<span className="font-black text-xl text-zinc-100">{${formatStr}(totalLikes)}</span>`
);

fs.writeFileSync('src/App.tsx', content);
