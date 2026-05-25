import { existsSync, readFileSync } from "node:fs";

const required = [
  "index.html",
  "styles.css",
  "assets/css/kolosseum.master.css",
  "assets/js/tool-pages.js",
  "script.js",
  "package.json",
  "favicon.svg",
  "tools/index.html",
  "tools/event-block-calculator/index.html",
  "tools/ironclock/index.html",
  "tools/gym-share/index.html",
  "tools/session-log/index.html",
  "tools/meet-planner/index.html",
  "tools/load-sheet/index.html"
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
const toolsIndex = readFileSync("tools/index.html", "utf8");
const cssAdapter = readFileSync("styles.css", "utf8");
const cssMaster = readFileSync("assets/css/kolosseum.master.css", "utf8");
const css = `${cssAdapter}\n${cssMaster}`;
const toolPagesJs = readFileSync("assets/js/tool-pages.js", "utf8");

const requiredHtmlFragments = [
  "viewport",
  "favicon.svg",
  "data-tool-card",
  "Event Block Calculator",
  "toolFunctionHost",
  "assets/icons/",
  "./styles.css",
  "./tools/event-block-calculator/"
];

for (const fragment of requiredHtmlFragments) {
  if (!html.includes(fragment)) {
    throw new Error(`Missing expected HTML fragment: ${fragment}`);
  }
}

const requiredToolsIndexFragments = [
  "Tool Index",
  "./event-block-calculator/",
  "./ironclock/",
  "./gym-share/",
  "./session-log/",
  "./meet-planner/",
  "./load-sheet/"
];

for (const fragment of requiredToolsIndexFragments) {
  if (!toolsIndex.includes(fragment)) {
    throw new Error(`Missing expected tools index fragment: ${fragment}`);
  }
}

const requiredCssFragments = [
  "@media (max-width: 1320px)",
  "@media (max-width: 1080px)",
  "@media (max-width: 820px)",
  "@media (max-width: 560px)",
  "overflow-x: hidden",
  "#99cf1b",
  "TOOL PAGES START"
];

for (const fragment of requiredCssFragments) {
  if (!css.includes(fragment)) {
    throw new Error(`Missing expected CSS fragment: ${fragment}`);
  }
}

if (!cssAdapter.includes("kolosseum.master.css")) {
  throw new Error("styles.css must import assets/css/kolosseum.master.css");
}

const requiredToolJsFragments = [
  "renderEventBlock",
  "renderIronClock",
  "renderGymShare",
  "renderSessionLog",
  "renderMeetPlanner",
  "renderLoadSheet"
];

for (const fragment of requiredToolJsFragments) {
  if (!toolPagesJs.includes(fragment)) {
    throw new Error(`Missing expected tool page JS fragment: ${fragment}`);
  }
}

JSON.parse(readFileSync("package.json", "utf8"));

console.log("Static site check passed.");