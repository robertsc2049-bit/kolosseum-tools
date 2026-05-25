import { existsSync, readFileSync } from "node:fs";

const required = [
  "index.html",
  "styles.css",
  "assets/css/kolosseum.master.css",
  "script.js",
  "package.json",
  "favicon.svg"
];

const forbidden = [
  /\bbest\b/i,
  /\boptimise\b/i,
  /\boptimize\b/i,
  /\bproven\b/i,
  /\bguarantee\b/i,
  /\bsafe\b/i,
  /\bprevent\b/i,
  /\binjury\b/i,
  /\brehab\b/i,
  /\btherapy\b/i,
  /\bmedical\b/i
];

const nonAscii = /[\u0080-\uFFFF]/;

for (const file of required) {
  if (!existsSync(file)) {
    throw new Error(`Missing required file: ${file}`);
  }

  const text = readFileSync(file, "utf8");

  if (text.charCodeAt(0) === 0xfeff) {
    throw new Error(`BOM found in ${file}`);
  }

  for (const pattern of forbidden) {
    if (pattern.test(text)) {
      throw new Error(`Forbidden wording matched ${pattern} in ${file}`);
    }
  }

  if (nonAscii.test(text)) {
    throw new Error(`Non-ASCII character found in ${file}`);
  }
}

const html = readFileSync("index.html", "utf8");
const cssAdapter = readFileSync("styles.css", "utf8");
const cssMaster = readFileSync("assets/css/kolosseum.master.css", "utf8");
const css = `${cssAdapter}\n${cssMaster}`;

const requiredHtmlFragments = [
  "viewport",
  "favicon.svg",
  "data-tool-card",
  "Event Block Calculator",
  "toolFunctionHost",
  "assets/icons/",
  "./styles.css"
];

for (const fragment of requiredHtmlFragments) {
  if (!html.includes(fragment)) {
    throw new Error(`Missing expected HTML fragment: ${fragment}`);
  }
}

const requiredCssFragments = [
  "@media (max-width: 1320px)",
  "@media (max-width: 1080px)",
  "@media (max-width: 820px)",
  "@media (max-width: 560px)",
  "overflow-x: hidden",
  "#99cf1b"
];

for (const fragment of requiredCssFragments) {
  if (!css.includes(fragment)) {
    throw new Error(`Missing expected CSS fragment: ${fragment}`);
  }
}

if (!cssAdapter.includes("kolosseum.master.css")) {
  throw new Error("styles.css must import assets/css/kolosseum.master.css");
}

JSON.parse(readFileSync("package.json", "utf8"));

console.log("Static site check passed.");