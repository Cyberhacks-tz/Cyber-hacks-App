const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
if (!code.includes('followers?: string[];')) {
  code = code.replace(/isPremium: boolean;/, "isPremium: boolean;\n  followers?: string[];\n  following?: string[];");
  fs.writeFileSync('src/types.ts', code);
}
