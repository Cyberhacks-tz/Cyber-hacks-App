const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Refactor handleReact
const newHandleReact = `  const handleReact = async (itemId: string, collectionName: string, type: 'like') => {
    if (!user) return;
    
    // Find item across all collections
    let item;
    let setItemState;
    if (collectionName === 'home_posts') { item = posts.find(p => p.id === itemId); setItemState = setPosts; }
    else if (collectionName === 'premium_apk') { item = premiumApps.find(p => p.id === itemId); setItemState = setPremiumApps; }
    else if (collectionName === 'cyber_news') { item = news.find(p => p.id === itemId); setItemState = setNews; }
    else if (collectionName === 'ai_prompts') { item = aiPrompts.find(p => p.id === itemId); setItemState = setAiPrompts; }
    
    if (!item || !setItemState) return;

    const currentReaction = item.userReactions?.[user.uid];
    const isRemoving = currentReaction === type;
    
    // Optimistic UI Update
    setItemState((prev: any[]) => prev.map(p => {
      if (p.id === itemId) {
        const currentReactionsCount = p.reactions?.[type] || 0;
        const newReactionsCount = isRemoving ? Math.max(0, currentReactionsCount - 1) : currentReactionsCount + 1;
        const newUserReactions = { ...p.userReactions };
        
        if (isRemoving) {
          delete newUserReactions[user.uid];
        } else {
          newUserReactions[user.uid] = type;
        }

        return {
          ...p,
          reactions: { ...p.reactions, [type]: newReactionsCount },
          userReactions: newUserReactions
        };
      }
      return p;
    }));

    const itemRef = doc(db, collectionName, itemId);

    try {
      if (isRemoving) {
        // Remove reaction
        await updateDoc(itemRef, {
          [\`reactions.\${type}\`]: Math.max(0, (item.reactions?.[type] || 0) - 1),
          [\`userReactions.\${user.uid}\`]: null
        });
      } else {
        // Change or add reaction
        const updates: any = {
          [\`reactions.\${type}\`]: (item.reactions?.[type] || 0) + 1,
          [\`userReactions.\${user.uid}\`]: type
        };
        if (currentReaction) {
          updates[\`reactions.\${currentReaction}\`] = Math.max(0, (item.reactions?.[currentReaction] || 0) - 1);
        }
        await updateDoc(itemRef, updates);
      }
    } catch (error) {
      // Revert optimistic update
      setItemState((prev: any[]) => prev.map(p => {
        if (p.id === itemId) return item;
        return p;
      }));
      handleFirestoreError(error, OperationType.UPDATE, \`\${collectionName}/\${itemId}\`);
    }
  };`;

content = content.replace(/const handleReact = async \([\s\S]*?handleFirestoreError[\s\S]*?\}\s*\};\s*const handleSaveConfig/m, newHandleReact + '\n\n  const handleSaveConfig');

// 2. Fix styles in Card
content = content.replace(
  /isLiked \? "bg-red-100 dark:bg-red-900\/30 text-red-500" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-red-500"/g,
  'isLiked ? "bg-red-900/30 text-red-500" : "bg-black text-zinc-400 hover:bg-zinc-900 hover:text-red-500"'
);

// 3. Fix styles in PremiumCard
content = content.replace(
  /\$\{userReaction === 'like' \? 'bg-red-900\/30 text-red-500' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-red-500'\}/g,
  "${userReaction === 'like' ? 'bg-red-900/30 text-red-500' : 'bg-black text-zinc-400 hover:bg-zinc-900 hover:text-red-500'}"
);

// 4. Fix styles in NewsCard
content = content.replace(
  /\$\{userReaction === 'like' \? 'bg-red-900\/30 text-red-500' : 'bg-black\/40 text-zinc-400 hover:bg-black\/60 hover:text-red-500'\}/g,
  "${userReaction === 'like' ? 'bg-red-900/30 text-red-500' : 'bg-black text-zinc-400 hover:bg-zinc-900 hover:text-red-500'}"
);

// 5. Fix styles in AiPromptCard (it probably uses the same as PremiumCard or NewsCard)

fs.writeFileSync('src/App.tsx', content);
