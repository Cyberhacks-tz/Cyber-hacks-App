const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const updatedProfileStats = `                const isRichard = displayedProfile?.email === 'richarddeogtatius18@gmail.com';
                const filterUserItems = (item: any) => item.authorId === displayedUid || (isRichard && !item.authorId);
                
                const userPosts = posts.filter(filterUserItems);
                const userApps = premiumApps.filter(filterUserItems);
                const userNews = news.filter(filterUserItems);
                const userPrompts = aiPrompts.filter(filterUserItems);
                
                const totalPostsCount = userPosts.length + userApps.length + userNews.length + userPrompts.length;
                const totalLikes = userPosts.reduce((acc, post) => acc + (post.reactions?.laugh || 0) + (post.reactions?.think || 0) + (post.reactions?.angry || 0), 0);
                const followersCount = (isAdmin && isOwnProfile) ? users.length : 0;`;

const regex = /const userPosts = posts\.filter\(p => p\.authorId === displayedUid\);\s*const totalLikes = [^;]+;\s*const followersCount = [^;]+;/;
content = content.replace(regex, updatedProfileStats);

const replaceUserPostsRegex = /<div className="text-xl font-black text-white">\{userPosts\.length\}<\/div>\s*<div className="text-\[10px\] text-zinc-500 uppercase font-bold tracking-wider">Posts<\/div>/;
content = content.replace(replaceUserPostsRegex, `<div className="text-xl font-black text-white">{totalPostsCount}</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Posts</div>`);

const filterAppsRegex = /const userApps = premiumApps\.filter\(a => a\.authorId === displayedUid\);/g;
content = content.replace(filterAppsRegex, '');

const filterNewsRegex = /const userNews = news\.filter\(n => n\.authorId === displayedUid\);/g;
content = content.replace(filterNewsRegex, '');

const filterPromptsRegex = /const userPrompts = aiPrompts\.filter\(p => p\.authorId === displayedUid\);/g;
content = content.replace(filterPromptsRegex, '');

fs.writeFileSync('src/App.tsx', content);
