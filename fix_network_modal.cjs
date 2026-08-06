const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldCode = `  useEffect(() => {
    if (isOpen) setTab(initialTab);
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const followers = users.filter(u => displayedProfile?.followers?.includes(u.uid));
  const following = users.filter(u => displayedProfile?.following?.includes(u.uid));
  
  const suggestions = useMemo(() => {
    if (!currentUserProfile) return [];
    let pot = users.filter(u => u.uid !== currentUserProfile.uid && !currentUserProfile.following?.includes(u.uid));
    const today = new Date().toDateString();
    let seed = 0;
    for(let i = 0; i < today.length; i++) seed += today.charCodeAt(i);
    const shuffled = [...pot].sort((a, b) => {
      const hashA = a.uid.charCodeAt(0) + seed;
      const hashB = b.uid.charCodeAt(0) + seed;
      return (hashA % 7) - (hashB % 7);
    });
    return shuffled.slice(0, 50);
  }, [users, currentUserProfile]);`;

const newCode = `  useEffect(() => {
    if (isOpen) setTab(initialTab);
  }, [isOpen, initialTab]);

  const followers = users.filter(u => displayedProfile?.followers?.includes(u.uid));
  const following = users.filter(u => displayedProfile?.following?.includes(u.uid));
  
  const suggestions = useMemo(() => {
    if (!currentUserProfile) return [];
    let pot = users.filter(u => u.uid !== currentUserProfile.uid && !currentUserProfile.following?.includes(u.uid));
    const today = new Date().toDateString();
    let seed = 0;
    for(let i = 0; i < today.length; i++) seed += today.charCodeAt(i);
    const shuffled = [...pot].sort((a, b) => {
      const hashA = a.uid.charCodeAt(0) + seed;
      const hashB = b.uid.charCodeAt(0) + seed;
      return (hashA % 7) - (hashB % 7);
    });
    return shuffled.slice(0, 50);
  }, [users, currentUserProfile]);

  if (!isOpen) return null;`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/App.tsx', content);
