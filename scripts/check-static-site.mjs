import { readFileSync, existsSync } from "node:fs";

const required = ["index.html", "styles.css", "script.js"];
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

  for (const pattern of forbidden) {
    if (pattern.test(text)) {
      throw new Error(`Forbidden wording matched ${pattern} in ${file}`);
    }
  }

  if (nonAscii.test(text)) {
    throw new Error(`Non-ASCII character found in ${file}`);
  }
}

console.log("Static site check passed.");
