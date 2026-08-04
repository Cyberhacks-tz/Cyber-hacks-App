const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/fakeLikes = Math\.floor\(hoursElapsed \* 1\.5\) \+ 5 \+ Math\.floor\(hoursElapsed \* 0\.5\) \+ 2 \+ Math\.floor\(hoursElapsed \* 0\.2\) \+ 1;/, 
`fakeLikes = Math.floor(hoursElapsed * 1.5) + 5;`);

fs.writeFileSync('src/App.tsx', code);
