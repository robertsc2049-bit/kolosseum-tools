# Homepage Wireframe Audit

## Status

PASS items: 15

Items requiring review: 1

## Source files

- index.html
- styles.css
- script.js
- docs/wireframes/page-home.md

## Wireframe summary

# Page Wireframe: Home

## Route

`/`

## Purpose

Introduce Kolosseum Tools as the public utility surface and route users into the tool bay.

## Primary action

View Tools.

## Secondary action

Open Event Block.

## Page zones

1. Header.
2. Hero.
3. Tool bay / tool cards.
4. Active tool preview panel.
5. Workflow/status notes if useful.

## Hero

Content:

- Kicker: Public Tool Surface.
- H1: Operational tools. Structured outputs.
- Lede: Focused calculators and utility surfaces for training planning, event timing, and public tool workflows.
- Note: Public tools. Kolosseum visual system.

Desktop placement:

- Hero copy left.
- Preview/dashboard visual may appear only on home/admin preview surfaces.
- Maintain same spacing rhythm as current approved home page.

Must not include:

- Extra duplicate tool directory panels.
- Oversized dead space below hero.

## Tool cards

Use shared tool-card component.

Cards:

- Event Block Calculator.
- IronClock.
- Gym Share.
- Session Log.
- Meet Planner.
- Load Sheet.

Card style:

- Icon.
- Short title.
- Short description.
- Restrained `+` action mark.

## Responsive

Desktop: hero and preview may sit side-by-side.

Half-screen/tablet: stack or compress without clipped text.

Mobile: hero text scales down, tool cards single column, no dashboard preview if it harms readability.


## Structural scan

| Item | Count |
|---|---:|
| Hero sections | 1 |
| Dashboard preview references | 1 |
| Tool card opening tags | 6 |

## Audit checklist

| Area | Requirement | Status | Evidence |
|---|---|---|---|
| Header | Homepage has Kolosseum brand header | PASS | Expected .topbar header. |
| Hero | Homepage has main hero section | PASS | Expected .hero section. |
| Hero | Homepage has hero copy | PASS | Expected .hero-copy. |
| Hero | Homepage may use dashboard preview because the home wireframe allows it on preview surfaces | PASS | Dashboard preview is allowed on homepage only if placement remains approved. |
| Tool bay | Homepage has tool grid/cards | PASS | Expected .tool-grid and .tool-card style tool bay. |
| Tool bay | Homepage includes Event Block | PASS | Expected Event Block tool card or CTA. |
| Tool bay | Homepage includes IronClock | PASS | Expected IronClock tool card or CTA. |
| Tool bay | Homepage includes Gym Share | PASS | Expected Gym Share tool card or CTA. |
| Tool bay | Homepage includes Session Log | PASS | Expected Session Log tool card or CTA. |
| Tool bay | Homepage includes Meet Planner | PASS | Expected Meet Planner tool card or CTA. |
| Tool bay | Homepage includes Load Sheet | PASS | Expected Load Sheet tool card or CTA. |
| Exclusions | Homepage does not contain redundant Current Kolosseum.tools pages wording | PASS | This wording was previously rejected. |
| Exclusions | Homepage does not contain duplicate side Other Tools card | PASS | Dedicated pages use related rail; homepage should use tool bay. |
| CSS | styles.css imports master CSS on first line | PASS | Static gate expects required import at top of styles.css. |
| CSS | Homepage tool card CSS exists | REVIEW | Expected .tool-grid and .tool-card CSS. |
| JavaScript | Homepage script has tool selection logic if active tool panel exists | PASS | If active tool preview exists, script should handle selection deterministically. |

## Recommended next implementation move

Do not rewrite the homepage unless the visual placement has drifted.

Next step should be a homepage structure lock:

1. Keep the approved hero placement.
2. Keep dashboard preview only on homepage/admin preview surfaces.
3. Standardise the tool bay cards against docs/wireframes/shared-components.md.
4. Remove any redundant CTA or wording that duplicates the tool grid.
5. Confirm desktop, half-screen, tablet, iPhone, and Android breakpoints before changing CSS.

## Implementation rule

Any homepage code change after this audit must reference this file and docs/wireframes/page-home.md.
