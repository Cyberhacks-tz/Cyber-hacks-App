const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const photoURL = canvas\.toDataURL\('image\/jpeg', 0\.8\);\s*try {[\s\S]*?\} finally \{\s*setGlobalLoading\(false\);\s*\}/;

const newLogic = `canvas.toBlob(async (blob) => {
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

content = content.replace(regex, newLogic);
fs.writeFileSync('src/App.tsx', content);
