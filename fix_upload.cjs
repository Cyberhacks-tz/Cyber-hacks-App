const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldUploadStr = `          canvas.toBlob(async (blob) => {
            if (!blob) {
              setGlobalLoading(false);
              return;
            }
            try {
              const storageRef = ref(storage, \`profileImages/\${user.uid}_\${Date.now()}.jpg\`);
              await uploadBytes(storageRef, blob);
              const photoURL = await getDownloadURL(storageRef);
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
          }, 'image/jpeg', 0.8);`;

const newUploadStr = `          const base64Image = canvas.toDataURL('image/jpeg', 0.8);
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

content = content.replace(oldUploadStr, newUploadStr);
fs.writeFileSync('src/App.tsx', content);
