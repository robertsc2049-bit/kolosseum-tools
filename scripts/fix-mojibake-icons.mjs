import { readFileSync, writeFileSync, existsSync } from "node:fs";

const files = {
  index: "index.html",
  css: "styles.css",
  script: "script.js",
  check: "scripts/check-static-site.mjs"
};

for (const path of Object.values(files)) {
  if (!existsSync(path)) {
    throw new Error(`Missing required file: ${path}`);
  }
}

let index = readFileSync(files.index, "utf8");
let css = readFileSync(files.css, "utf8");

const tools = [
  ["Event Block Calculator", "EB"],
  ["IronClock", "IC"],
  ["Gym Share", "GS"],
  ["Session Log", "SL"],
  ["Meet Planner", "MP"],
  ["Load Sheet", "LS"]
];

for (const [title, code] of tools) {
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `<div class="feature-icon"[^>]*>[\\s\\S]*?<\\/div>\\s*<div>\\s*<h2>${escapedTitle}<\\/h2>`,
    "g"
  );

  index = index.replace(
    pattern,
    `<div class="feature-icon" data-icon="${code}"></div><div><h2>${title}</h2>`
  );
}

index = index.replace(
  /<button type="button" data-tool-action([^>]*)>[\s\S]*?<\/button>/g,
  '<button type="button" data-tool-action$1><span aria-hidden="true">+</span></button>'
);

index = index.replace(
  /<span aria-hidden="true">[\s\S]*?<\/span>/g,
  '<span aria-hidden="true">+</span>'
);

const statusCodes = [
  ["PUBLIC SURFACE", "PS"],
  ["SINGLE ACTIVE TOOL", "AT"],
  ["CONSISTENT LAYOUT", "CL"],
  ["PLATFORM-ADJACENT", "PA"]
];

for (const [title, code] of statusCodes) {
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `<span[^>]*>[\\s\\S]*?<\\/span>\\s*<strong>${escapedTitle}<\\/strong>`,
    "g"
  );

  index = index.replace(
    pattern,
    `<span class="status-code">${code}</span><strong>${title}</strong>`
  );
}

index = index.replace(/[\u0080-\uFFFF]/g, "");

const start = "/* === KOLOSSEUM ASCII ICON SYSTEM START === */";
const end = "/* === KOLOSSEUM ASCII ICON SYSTEM END === */";
const blockPattern = new RegExp(
  start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?" + end.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  "g"
);

css = css.replace(blockPattern, "").trimEnd();

const iconCss = `
${start}

.feature-icon {
  position: relative;
  overflow: hidden;
  font-size: 0;
}

.feature-icon::before {
  content: attr(data-icon);
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  font-family: var(--font-display);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #9bd21a;
  text-shadow:
    0 0 7px rgba(153,207,27,0.34),
    0 0 16px rgba(153,207,27,0.14);
}

.feature-icon::after {
  content: "";
  position: absolute;
  inset: 9px;
  border: 1px solid rgba(153,207,27,0.26);
  border-radius: 6px;
  box-shadow:
    0 0 10px rgba(153,207,27,0.12),
    inset 0 0 8px rgba(153,207,27,0.055);
}

.feature-card button {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: #9bd21a;
  text-shadow:
    0 0 7px rgba(153,207,27,0.28),
    0 0 14px rgba(153,207,27,0.10);
}

.status-code {
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #9bd21a;
  text-shadow:
    0 0 7px rgba(153,207,27,0.30),
    0 0 16px rgba(153,207,27,0.12);
}

.button span[aria-hidden="true"],
.nav-action span[aria-hidden="true"] {
  font-family: var(--font-display);
  font-weight: 700;
}

${end}
`;

css = `${css}\n\n${iconCss}`;
css = css.replace(/[\u0080-\uFFFF]/g, "");

const check = `import { readFileSync, existsSync } from "node:fs";

const required = ["index.html", "styles.css", "script.js"];
const forbidden = [
  /\\bbest\\b/i,
  /\\boptimise\\b/i,
  /\\boptimize\\b/i,
  /\\bproven\\b/i,
  /\\bguarantee\\b/i,
  /\\bsafe\\b/i,
  /\\bprevent\\b/i,
  /\\binjury\\b/i,
  /\\brehab\\b/i,
  /\\btherapy\\b/i,
  /\\bmedical\\b/i
];

const nonAscii = /[\\u0080-\\uFFFF]/;

for (const file of required) {
  if (!existsSync(file)) {
    throw new Error(\`Missing required file: \${file}\`);
  }

  const text = readFileSync(file, "utf8");

  for (const pattern of forbidden) {
    if (pattern.test(text)) {
      throw new Error(\`Forbidden wording matched \${pattern} in \${file}\`);
    }
  }

  if (nonAscii.test(text)) {
    throw new Error(\`Non-ASCII character found in \${file}\`);
  }
}

console.log("Static site check passed.");
`;

writeFileSync(files.index, index, { encoding: "utf8" });
writeFileSync(files.css, css, { encoding: "utf8" });
writeFileSync(files.check, check, { encoding: "utf8" });

console.log("Mojibake cleanup completed.");