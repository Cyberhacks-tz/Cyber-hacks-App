const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

const interfaces = ['PremiumApp', 'AiPrompt', 'CyberNews'];
interfaces.forEach(intf => {
  const regex = new RegExp(`export interface ${intf} \\{[\\s\\S]*?\\}`);
  let match = code.match(regex);
  if (match) {
    let block = match[0];
    if (!block.includes('reactions?:')) {
      block = block.replace(/\}$/, `  reactions?: { like?: number };\n  userReactions?: { [userId: string]: 'like' };\n}`);
      code = code.replace(match[0], block);
    }
  }
});

fs.writeFileSync('src/types.ts', code);
