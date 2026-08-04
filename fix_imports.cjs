const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('arrayUnion')) {
  code = code.replace(/serverTimestamp\n\} from 'firebase\/firestore';/, "serverTimestamp,\n  arrayUnion,\n  arrayRemove\n} from 'firebase/firestore';");
}

fs.writeFileSync('src/App.tsx', code);
