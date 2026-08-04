const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix 1: src/App.tsx(3401,32): error TS2304: Cannot find name 'item'.
code = code.replace(/reactions=\{item\.reactions\}/g, "reactions={post.reactions}");

// Fix 2: src/App.tsx(3615,33): error TS2304: Cannot find name 'item'.
code = code.replace(/return acc \+ \(item\.reactions\?\.like \|\| 0\) \+ fakeLikes;/g, "return acc + (post.reactions?.like || 0) + fakeLikes;");

// Fix 3: src/App.tsx(3617,84): error TS2304: Cannot find name 'displayUser'.
code = code.replace(/displayUser\.followers/g, "displayedProfile?.followers");
code = code.replace(/displayUser\.uid/g, "displayedUid");

fs.writeFileSync('src/App.tsx', code);
