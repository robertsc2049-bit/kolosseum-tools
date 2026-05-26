import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "index.html",
  "styles.css",
  "assets/css/kolosseum.colours.css",
  "assets/css/base.css",
  "assets/js/main.js",
  "tools/index.html"
];

const forbiddenPatterns = [
  /\bsafe\b/i,
  /\bguaranteed\b/i,
  /\bworld[- ]?class\b/i,
  /\bbest\b/i,
  /\bultimate\b/i,
  /\bdemo\b/i,
  /\bv2\b/i,
  /\bpreview\b/i
];

function filePath(file) {
  return path.join(root, file);
}

function read(file) {
  return fs.readFileSync(filePath(file), "utf8");
}

for (const file of requiredFiles) {
  if (!fs.existsSync(filePath(file))) {
    throw new Error(`Missing required file: ${file}`);
  }
}

const styles = read("styles.css");
if (!styles.startsWith('@import url("./assets/css/kolosseum.colours.css");')) {
  throw new Error("styles.css must import assets/css/kolosseum.colours.css on line 1");
}

for (const file of requiredFiles.filter((item) => /\.(html|css|js)$/.test(item))) {
  const content = read(file);

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      throw new Error(`Forbidden wording matched ${pattern} in ${file}`);
    }
  }
}

for (const file of requiredFiles.filter((item) => item.endsWith(".html"))) {
  const content = read(file);

  if (!/<meta name="viewport"/.test(content)) {
    throw new Error(`Missing viewport meta in ${file}`);
  }

  if (!/<link rel="stylesheet" href=/.test(content)) {
    throw new Error(`Missing stylesheet link in ${file}`);
  }

  if (/<script(?![^>]+src=)[^>]*>/.test(content)) {
    throw new Error(`Inline script found in ${file}`);
  }
}

console.log("Static site check passed.");
