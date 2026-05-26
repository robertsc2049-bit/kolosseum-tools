import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "index.html",
  "styles.css",
  "assets/css/kolosseum.master.css",
  "assets/css/components.css",
  "assets/css/tools.css",
  "assets/js/shared.js",
  "assets/js/gym-share.js",
  "tools/index.html",
  "tools/ironclock/index.html",
  "tools/event-block-calculator/index.html",
  "tools/gym-share/index.html",
  "tools/session-log/index.html",
  "tools/meet-planner/index.html",
  "tools/load-sheet/index.html"
];

const forbiddenPatterns = [
  /\bsafe\b/i,
  /\bguaranteed\b/i,
  /\bworld[- ]?class\b/i,
  /\bbest\b/i,
  /\bultimate\b/i
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
if (!styles.startsWith('@import url("./assets/css/kolosseum.master.css");')) {
  throw new Error("styles.css must import assets/css/kolosseum.master.css on line 1");
}

const scannedFiles = requiredFiles.filter((file) => /\.(html|css|js)$/.test(file));

for (const file of scannedFiles) {
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

  if (/other-tools-card/.test(content)) {
    throw new Error(`Legacy related card found in ${file}`);
  }

  if (/TOOL STATUS/.test(content)) {
    throw new Error(`Decorative status panel found in ${file}`);
  }

  if (/<script(?![^>]+src=)[^>]*>/.test(content)) {
    throw new Error(`Inline script found in ${file}`);
  }
}

console.log("Static site check passed.");
