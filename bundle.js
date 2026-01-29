const fs = require('fs');
const path = require('path');

// Configuration: Files/folders to ignore
const IGNORE_LIST = ['node_modules', '.git', '.next', 'dist', 'bundle.js', 'package-lock.json', '.env.local'];
const ALLOWED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'];

const outputFile = 'project_context.md';
let content = "# Project Directory Context\n\n";

function bundleFiles(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      if (!IGNORE_LIST.includes(file)) {
        bundleFiles(filePath);
      }
    } else {
      const ext = path.extname(file);
      if (ALLOWED_EXTENSIONS.includes(ext) && !IGNORE_LIST.includes(file)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        content += `\n## FILE: ${filePath}\n\n\`\`\`${ext.replace('.', '')}\n${fileData}\n\`\`\`\n---\n`;
      }
    }
  });
}

console.log("🚀 Bundling your project...");
bundleFiles('.');
fs.writeFileSync(outputFile, content);
console.log(`✅ Done! Your project is ready in: ${outputFile}`);