const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const userStateStr = `  const [users, setUsers] = useState<UserProfile[]>([]);
  const [password, setPassword] = useState('');`;

content = content.replace("  const [password, setPassword] = useState('');", userStateStr);

const fetchUsersStr = `  // Data Fetching
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
    });
    return unsub;
  }, []);

  useEffect(() => {`;

content = content.replace(/  \/\/ Data Fetching\n  useEffect\(\(\) => \{/, fetchUsersStr);

fs.writeFileSync('src/App.tsx', content);
