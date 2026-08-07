const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `  const handleToggleFollowGlobal = async (targetUid: string) => {
    if (!user) return;
    const targetUser = users.find(u => u.uid === targetUid);
    if (!targetUser) return;
    const isFollowing = targetUser.followers?.includes(user.uid);
    const targetUserRef = doc(db, 'users', targetUid);
    const currentUserRef = doc(db, 'users', user.uid);
    try {
      if (isFollowing) {
        await updateDoc(targetUserRef, { followers: arrayRemove(user.uid) });
        await updateDoc(currentUserRef, { following: arrayRemove(targetUid) });
        if (profile) setProfile({ ...profile, following: (profile.following || []).filter(id => id !== targetUid) });
      } else {
        await updateDoc(targetUserRef, { followers: arrayUnion(user.uid) });
        await updateDoc(currentUserRef, { following: arrayUnion(targetUid) });
        if (profile) setProfile({ ...profile, following: [...(profile.following || []), targetUid] });
      }
    } catch (e) { console.error("Error following:", e); }
  };`;

const replaceStr = `  const handleToggleFollowGlobal = async (targetUid: string) => {
    if (!user) return;
    const targetUser = users.find(u => u.uid === targetUid);
    if (!targetUser) return;
    const isFollowing = targetUser.followers?.includes(user.uid);
    const targetUserRef = doc(db, 'users', targetUid);
    const currentUserRef = doc(db, 'users', user.uid);
    
    setUsers(prev => prev.map(u => {
      if (u.uid === targetUid) {
        return {
          ...u,
          followers: isFollowing 
            ? (u.followers || []).filter(id => id !== user.uid)
            : [...(u.followers || []), user.uid]
        };
      }
      if (u.uid === user.uid) {
         return {
           ...u,
           following: isFollowing
             ? (u.following || []).filter(id => id !== targetUid)
             : [...(u.following || []), targetUid]
         }
      }
      return u;
    }));
    
    setProfile(prev => prev ? {
      ...prev,
      following: isFollowing
        ? (prev.following || []).filter(id => id !== targetUid)
        : [...(prev.following || []), targetUid]
    } : null);

    try {
      if (isFollowing) {
        await updateDoc(targetUserRef, { followers: arrayRemove(user.uid) });
        await updateDoc(currentUserRef, { following: arrayRemove(targetUid) });
      } else {
        await updateDoc(targetUserRef, { followers: arrayUnion(user.uid) });
        await updateDoc(currentUserRef, { following: arrayUnion(targetUid) });
      }
    } catch (e) { console.error("Error following:", e); }
  };`;

content = content.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', content);
