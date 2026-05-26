# Homepage Structure Lock

## Status

Locked for implementation.

This document records the approved homepage structure after docs/wireframes/audits/page-home-audit.md.

## Source files

- index.html
- styles.css
- script.js
- docs/wireframes/page-home.md
- docs/wireframes/audits/page-home-audit.md

## Locked structure

| Zone | Decision |
|---|---|
| Header | Keep existing Kolosseum Tools topbar. |
| Hero | Keep approved homepage hero placement. |
| Dashboard preview | Allowed on homepage only. Preserve current placement unless a new wireframe explicitly replaces it. |
| Tool bay | Use shared tool-card language: icon, title, short copy, restrained plus action mark. |
| Active preview | Allowed only if it supports the tool bay and does not duplicate dedicated page functionality. |
| Related tools rail | Not required on homepage. Homepage uses tool bay instead. |

## Current structural counts

| Item | Count |
|---|---:|
| Hero sections | 1 |
| Dashboard preview references | 1 |
| Tool card references | 6 |

## Must not add

- Decorative status side cards.
- Duplicate Other Tools side cards.
- Redundant directory wording.
- Large Open pills on cards.
- Extra dashboard previews outside the approved hero/admin preview context.
- Inline scripts for homepage behaviour.

## Responsive lock

Desktop:

- Preserve approved hero/dashboard composition.
- Tool bay can use three columns.

Half-screen desktop:

- Tool bay switches to two columns before text collides.
- Hero/dashboard must not clip or create horizontal overflow.

Tablet:

- Stack heavy visual elements if needed.
- Tool cards use two or one columns depending on width.

Mobile:

- Single-column cards.
- Full-width touch targets where buttons are functional.
- No horizontal overflow.

## Implementation rule

Future homepage changes must update this file first if they alter page zones, card behaviour, dashboard placement, or responsive rules.
