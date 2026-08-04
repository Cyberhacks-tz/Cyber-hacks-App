const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { arrayUnion')) {
  // Let's just find the existing firestore imports and replace them completely
  code = code.replace(/import\s*\{\s*collection,\s*addDoc,\s*onSnapshot,\s*query,\s*orderBy,\s*doc,\s*updateDoc,\s*deleteDoc,\s*setDoc,\s*getDoc,\s*getDocs,\s*limit,\s*startAfter,\s*where,\s*getDocFromServer,\s*serverTimestamp\s*\}\s*from\s*'firebase\/firestore';/, 
  "import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, setDoc, getDoc, getDocs, limit, startAfter, where, getDocFromServer, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';");
}

fs.writeFileSync('src/App.tsx', code);
