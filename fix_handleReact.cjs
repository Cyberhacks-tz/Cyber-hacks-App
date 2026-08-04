const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update handleReact definition
code = code.replace(/const handleReact = async \(postId: string, type: 'like'\) => \{[\s\S]*?try \{/m,
`const handleReact = async (itemId: string, collectionName: string, type: 'like') => {
    if (!user) return;
    
    // Find item across all collections
    let item;
    if (collectionName === 'home_posts') item = posts.find(p => p.id === itemId);
    else if (collectionName === 'premium_apk') item = premiumApps.find(p => p.id === itemId);
    else if (collectionName === 'cyber_news') item = news.find(p => p.id === itemId);
    else if (collectionName === 'ai_prompts') item = aiPrompts.find(p => p.id === itemId);
    
    if (!item) return;

    const currentReaction = item.userReactions?.[user.uid];
    const itemRef = doc(db, collectionName, itemId);

    try {`);

code = code.replace(/postRef/g, 'itemRef');
code = code.replace(/post\.reactions/g, 'item.reactions');
code = code.replace(/handleFirestoreError\(error, OperationType\.UPDATE, \`home_posts\/\$\{postId\}\`\);/,
`handleFirestoreError(error, OperationType.UPDATE, \`\${collectionName}/\${itemId}\`);`);

// Update the calls to handleReact
code = code.replace(/handleReact\(post\.id, type\)/g, "handleReact(post.id, 'home_posts', type)");
code = code.replace(/handleReact\(app\.id, 'like'\)/g, "handleReact(app.id, 'premium_apk', 'like')");
code = code.replace(/handleReact\(n\.id, 'like'\)/g, "handleReact(n.id, 'cyber_news', 'like')");
code = code.replace(/handleReact\(p\.id, 'like'\)/g, "handleReact(p.id, 'ai_prompts', 'like')");
code = code.replace(/handleReact\(prompt\.id, 'like'\)/g, "handleReact(prompt.id, 'ai_prompts', 'like')");

fs.writeFileSync('src/App.tsx', code);
