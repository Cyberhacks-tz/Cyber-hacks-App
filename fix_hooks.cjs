const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// The broken code looks like this:
//     const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
//       setUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
//     });
//   useEffect(() => {
//     if (!user || !users.length) return;
//     const adminUser = users.find(u => u.email === 'richarddeogtatius18@gmail.com');
//     if (adminUser && user.email !== 'richarddeogtatius18@gmail.com') {
//       const myProfile = users.find(u => u.uid === user.uid);
//       if (myProfile && !myProfile.following?.includes(adminUser.uid)) {
//         updateDoc(doc(db, 'users', user.uid), { following: arrayUnion(adminUser.uid) }).catch(() => {});
//         updateDoc(doc(db, 'users', adminUser.uid), { followers: arrayUnion(user.uid) }).catch(() => {});
//       }
//     }
//   }, [user, users]);
// 
//     return unsub;
//   }, []);

const target = `    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
    });
  useEffect(() => {
    if (!user || !users.length) return;
    const adminUser = users.find(u => u.email === 'richarddeogtatius18@gmail.com');
    if (adminUser && user.email !== 'richarddeogtatius18@gmail.com') {
      const myProfile = users.find(u => u.uid === user.uid);
      if (myProfile && !myProfile.following?.includes(adminUser.uid)) {
        updateDoc(doc(db, 'users', user.uid), { following: arrayUnion(adminUser.uid) }).catch(() => {});
        updateDoc(doc(db, 'users', adminUser.uid), { followers: arrayUnion(user.uid) }).catch(() => {});
      }
    }
  }, [user, users]);

    return unsub;
  }, []);`;

const replacement = `    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user || !users.length) return;
    const adminUser = users.find(u => u.email === 'richarddeogtatius18@gmail.com');
    if (adminUser && user.email !== 'richarddeogtatius18@gmail.com') {
      const myProfile = users.find(u => u.uid === user.uid);
      if (myProfile && !myProfile.following?.includes(adminUser.uid)) {
        updateDoc(doc(db, 'users', user.uid), { following: arrayUnion(adminUser.uid) }).catch(() => {});
        updateDoc(doc(db, 'users', adminUser.uid), { followers: arrayUnion(user.uid) }).catch(() => {});
      }
    }
  }, [user, users]);`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
