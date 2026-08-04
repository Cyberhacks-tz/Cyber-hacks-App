const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetButton = `<button className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-green-600 to-purple-600 rounded-full border-[3px] border-black hover:scale-105 active:scale-95 transition-transform">
                    <Pencil size={14} className="text-white" />
                  </button>`;

const newLabel = `<label className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-green-600 to-purple-600 rounded-full border-[3px] border-black hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                    <Pencil size={14} className="text-white" />
                  </label>`;

if (content.includes(targetButton)) {
  content = content.replace(targetButton, newLabel);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Replaced pencil button with label");
} else {
  console.log("Could not find pencil button");
}
