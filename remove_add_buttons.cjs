const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regexes = [
  /\{ isAdmin && \(\s*<button\s*type="button"\s*onClick=\{\(\) => setModalOpen\('app'\)\}[\s\S]*?<\/button>\s*\)\}/g,
  /\{ isAdmin && \(\s*<button\s*type="button"\s*onClick=\{\(\) => setModalOpen\('news'\)\}[\s\S]*?<\/button>\s*\)\}/g,
  /\{ isAdmin && \(\s*<button\s*type="button"\s*onClick=\{\(\) => setModalOpen\('aiprompt'\)\}[\s\S]*?<\/button>\s*\)\}/g,
  /\{ isAdmin && \(\s*<button\s*type="button"\s*onClick=\{\(\) => setModalOpen\('post'\)\}[\s\S]*?<\/button>\s*\)\}/g
];

let replaced = false;
regexes.forEach(r => {
  const match = content.match(r);
  if (match) {
    content = content.replace(r, '');
    replaced = true;
  }
});

if (replaced) {
  fs.writeFileSync('src/App.tsx', content);
  console.log("Removed old add buttons.");
} else {
  console.log("Could not find old add buttons.");
}
