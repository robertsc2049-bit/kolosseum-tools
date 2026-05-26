# Shared Component Contract

## Header

Purpose: brand, primary navigation, and current route CTA.

Must include:

- Kolosseum Tools logo.
- Home link.
- Tools link.
- Workflow link when relevant.
- Status link when relevant.
- One route CTA.

Must not include:

- Overcrowded navigation.
- Repeated CTA labels.
- Elements that force horizontal overflow.

Responsive:

- Desktop: logo left, nav and CTA right.
- Tablet/mobile: compact nav, no wrapping into broken rows.

## Tool hero

Purpose: explain the page in one glance.

Zones:

1. Kicker.
2. H1.
3. One short lede.
4. Optional note row.

Must not include:

- Decorative dashboard previews unless on the home/admin preview surface.
- Status cards that reduce the active tool width.
- Redundant CTAs when tools are immediately below.

## Active tool panel

Purpose: the actual utility.

Required structure:

1. Panel heading with kicker and tool name.
2. Status pill only if small and non-invasive.
3. Form/input side.
4. Output/result side.
5. Action buttons.

Desktop:

- Use full page width.
- Form column normally 300px to 420px.
- Output column takes remaining width.

Tablet/mobile:

- Stack form then output.
- Buttons full width on mobile.
- No horizontal overflow.

## Related tools rail

Purpose: compact cross-navigation between dedicated tool pages.

Placement:

- Below the active tool.
- Above footer.

Allowed style:

- One low-profile horizontal/card rail.
- Icon plus short label.
- “View all” link.

Must not include:

- Large side card.
- Duplicate current page unless intentionally shown as disabled.
- Long descriptions.

## QR module

Purpose: visible preview and printable output.

Required:

- Visible QR preview after valid input.
- Print QR button.
- Hidden print-only panel.
- External JS only.
- No inline script.

Implementation rule:

- Prefer local QR generation if practical.
- If using external QR image service temporarily, CSP must allow the image host and the page must degrade cleanly.

## Forms

Required:

- Labels, not placeholders only.
- Clear primary button.
- Inputs sized to page rhythm.
- No white browser-default controls caused by missing CSS.

## Results

Required:

- Clear waiting state.
- Clear ready state.
- Copy/export button where relevant.
- Monospace output only where text format matters.
