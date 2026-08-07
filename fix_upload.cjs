const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Update import
content = content.replace(
  "import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';",
  "import { ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage';"
);

const oldUploadFunc = `          const base64Image = canvas.toDataURL('image/jpeg', 0.8);
          try {
            await updateProfile(user, { photoURL: base64Image });
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { photoURL: base64Image }, { merge: true });
            if (profile) {
              setProfile({ ...profile, photoURL: base64Image });
            }
          } catch(err) {
             console.error('Error saving profile picture:', err);
             alert('Failed to update profile picture.');
          } finally {
            setGlobalLoading(false);
          }`;

const newUploadFunc = `          const base64Image = canvas.toDataURL('image/jpeg', 0.8);
          try {
            const storageRef = ref(storage, \`avatars/\${user.uid}_\${Date.now()}.jpg\`);
            await uploadString(storageRef, base64Image, 'data_url');
            const downloadURL = await getDownloadURL(storageRef);
            
            await updateProfile(user, { photoURL: downloadURL });
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { photoURL: downloadURL }, { merge: true });
            if (profile) {
              setProfile({ ...profile, photoURL: downloadURL });
            }
          } catch(err) {
             console.error('Error saving profile picture:', err);
             alert('Failed to update profile picture.');
          } finally {
            setGlobalLoading(false);
          }`;

content = content.replace(oldUploadFunc, newUploadFunc);

fs.writeFileSync('src/App.tsx', content);
