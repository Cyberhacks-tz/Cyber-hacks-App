const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldFunc = `  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };`;

const newFunc = `  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    try {
      setGlobalLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const photoURL = canvas.toDataURL('image/jpeg', 0.8);
          
          try {
            await updateProfile(user, { photoURL });
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { photoURL }, { merge: true });
            if (profile) {
              setProfile({ ...profile, photoURL });
            }
          } catch(err) {
             console.error('Error saving profile picture:', err);
             alert('Failed to update profile picture.');
          } finally {
            setGlobalLoading(false);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to update profile picture. Please try again.');
      setGlobalLoading(false);
    }
  };`;

if (content.includes(oldFunc)) {
  content = content.replace(oldFunc, newFunc);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Replaced image upload logic with base64.");
} else {
  console.log("Could not find upload logic.");
}
