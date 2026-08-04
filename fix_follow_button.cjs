const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Calculate real followers count
code = code.replace(/const followersCount = \(isAdmin && isOwnProfile\) \? users\.length : 0;/, 
`const followersCount = (isAdmin && isOwnProfile) ? users.length : (displayUser.followers?.length || 0);`);

// Calculate if current user follows this user
const isFollowingDecl = `
                const isFollowing = user && displayUser.followers?.includes(user.uid);
                const toggleFollow = async () => {
                  if (!user) return;
                  const targetUserRef = doc(db, 'users', displayUser.uid);
                  const currentUserRef = doc(db, 'users', user.uid);
                  try {
                    if (isFollowing) {
                      await updateDoc(targetUserRef, { followers: arrayRemove(user.uid) });
                      await updateDoc(currentUserRef, { following: arrayRemove(displayUser.uid) });
                    } else {
                      await updateDoc(targetUserRef, { followers: arrayUnion(user.uid) });
                      await updateDoc(currentUserRef, { following: arrayUnion(displayUser.uid) });
                    }
                  } catch (e) { console.error("Error following:", e); }
                };
`;

code = code.replace(/const followersCount = [^;]+;/, `const followersCount = (isAdmin && isOwnProfile) ? users.length : (displayUser.followers?.length || 0);${isFollowingDecl}`);

// Add the Follow button below the stats
const followButtonHtml = `
                        <div className="flex flex-col items-center">
                          <span className="font-black text-xl text-zinc-100">{totalLikes}</span>
                          <span className="text-xs text-zinc-500 font-medium">Likes</span>
                        </div>
                      </div>
                      
                      {!isOwnProfile && (
                        <div className="mt-6 mb-2 w-full flex justify-center">
                          <button 
                            onClick={toggleFollow}
                            className={\`px-8 py-2 rounded-xl font-bold transition-all text-sm w-full max-w-[250px] shadow-md active:scale-95 \${isFollowing ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'}\`}
                          >
                            {isFollowing ? 'Following' : 'Follow'}
                          </button>
                        </div>
                      )}
`;
code = code.replace(/<div className="flex flex-col items-center">\s*<span className="font-black text-xl text-zinc-100">\{totalLikes\}<\/span>\s*<span className="text-xs text-zinc-500 font-medium">Likes<\/span>\s*<\/div>\s*<\/div>/, followButtonHtml);

// Add imports for arrayRemove and arrayUnion if not present
if (!code.includes('arrayRemove')) {
  code = code.replace(/import \{ collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp, setDoc \} from 'firebase\/firestore';/, 
  "import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';");
}

fs.writeFileSync('src/App.tsx', code);
