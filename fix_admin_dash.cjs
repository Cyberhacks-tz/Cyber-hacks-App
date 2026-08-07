const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldAdminStart = `const AdminDashboard = ({ t, theme, onUserClick }: { t: (k: string) => string, theme: string, onUserClick: (u: UserProfile) => void }) => {
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const u = snapshot.docs.map(doc => doc.data() as UserProfile);
      setUsersList(u);
      setLoadingUsers(false);
    }, (error) => {
       console.error("Error fetching users", error);
       setLoadingUsers(false);
    });
    return unsub;
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogins = usersList.filter(u => u.lastActiveDate === todayStr);`;

const newAdminStart = `const AdminDashboard = ({ t, theme, onUserClick }: { t: (k: string) => string, theme: string, onUserClick: (u: UserProfile) => void }) => {
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const u = snapshot.docs.map(doc => doc.data() as UserProfile);
      setUsersList(u);
      setLoadingUsers(false);
    }, (error) => {
       console.error("Error fetching users", error);
       setLoadingUsers(false);
    });
    return unsub;
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogins = usersList.filter(u => u.lastActiveDate === todayStr);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return usersList;
    return usersList.filter(u => 
      (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, usersList]);`;

content = content.replace(oldAdminStart, newAdminStart);

const oldAllUsers = `         <h3 className={cn("text-lg font-bold mb-4", theme === 'dark' ? "text-white" : "text-zinc-100")}>All Users</h3>
         <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            
            {usersList.map(u => (`;

const newAllUsers = `         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
           <h3 className={cn("text-lg font-bold", theme === 'dark' ? "text-white" : "text-zinc-100")}>All Users</h3>
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
             <input
               type="text"
               placeholder="Search users..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className={cn(
                 "pl-9 pr-4 py-2 rounded-xl text-sm border outline-none w-full sm:w-64 transition-colors",
                 theme === 'dark' 
                   ? "bg-zinc-800 border-zinc-700 text-white focus:border-purple-500" 
                   : "bg-zinc-100 border-zinc-200 text-zinc-900 focus:border-purple-500"
               )}
             />
           </div>
         </div>
         <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            
            {filteredUsers.map(u => (`;

content = content.replace(oldAllUsers, newAllUsers);
fs.writeFileSync('src/App.tsx', content);
