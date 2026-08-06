const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// We know MarkdownRenderer ends at:
//     </div>
//   );
// };
// const MarkdownRenderer = ({ content }: { content: string }) => {

// Let's find the MarkdownRenderer block and remove the AnimatePresence blocks

const startStr = `<SyntaxHighlighter`;
const endStr = `    </div>\n  );\n};`;

const blockStart = content.indexOf('const CodeBlock');
const blockEnd = content.indexOf('const MarkdownRenderer');

let codeBlockContent = content.substring(blockStart, blockEnd);
codeBlockContent = codeBlockContent.replace(/<AnimatePresence>[\s\S]*?<\/AnimatePresence>/g, '');
content = content.substring(0, blockStart) + codeBlockContent + content.substring(blockEnd);

// Fix the renderUser in NetworkModal
const oldNetworkModalRenderUser = `{tab === 'suggestions' && suggestions.map((u, i) => renderUser(u, i))}`;
const newNetworkModalRenderUser = `{tab === 'suggestions' && suggestions.map(renderUser)}`;
content = content.replace(oldNetworkModalRenderUser, newNetworkModalRenderUser);

fs.writeFileSync('src/App.tsx', content);
