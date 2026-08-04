const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace(/laugh\?: number;\n\s*think\?: number;\n\s*angry\?: number;/g, 'like?: number;');
code = code.replace(/'laugh' \| 'think' \| 'angry'/g, "'like'");
fs.writeFileSync('src/types.ts', code);
