const fs = require("fs");
const path = require("path");

const root = __dirname;
const out = path.join(root, "dist");

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function copyRecursive(source, destination) {
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    fs.mkdirSync(destination, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(destination, entry));
    }
  } else {
    fs.copyFileSync(source, destination);
  }
}

for (const item of ["index.html", "style.css", "script.js", "audio"]) {
  const source = path.join(root, item);
  if (fs.existsSync(source)) {
    copyRecursive(source, path.join(out, item));
  }
}

console.log("Build complete: dist/ (including audio/)");
