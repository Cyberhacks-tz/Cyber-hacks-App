const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// The block starts with {profileTab === 'followers' && ( and ends with {profileTab === 'hacks' && (
const startIndex = content.indexOf("{profileTab === 'followers' && (");
const endIndex = content.indexOf("{profileTab === 'hacks' && (");

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + content.substring(endIndex);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Successfully removed sections");
} else {
  console.log("Could not find sections");
}

