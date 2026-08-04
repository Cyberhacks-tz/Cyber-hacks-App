const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const uploadLogic = `
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    try {
      setGlobalLoading(true);
      const storageRef = ref(storage, \`avatars/\${user.uid}_\${Date.now()}\`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL });
      
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { photoURL }, { merge: true });
      
      if (profile) {
        setProfile({ ...profile, photoURL });
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to update profile picture. Please try again.');
    } finally {
      setGlobalLoading(false);
    }
  };
`;

const targetString = `  // Apply theme to document automatically`;
if (content.includes(targetString)) {
  content = content.replace(targetString, uploadLogic + '\n' + targetString);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Added handleProfileImageUpload");
} else {
  console.log("Could not find target string");
}
