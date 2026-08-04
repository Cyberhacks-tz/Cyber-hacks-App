const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `  }

  if (profile?.banned) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <Ban size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-black mb-2">Account Banned</h2>
        <p className="text-zinc-400 mb-8 max-w-sm">Your account has been banned. Create a new account.</p>
        <button onClick={() => auth.signOut()} className="bg-white text-black px-8 py-3 rounded-full font-bold">Logout</button>
      </div>
    );
  }`;

content = content.replace("  }\n\n  if (!user) {", replacement + "\n\n  if (!user) {");
fs.writeFileSync('src/App.tsx', content);
