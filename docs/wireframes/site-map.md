# Kolosseum Tools Site Map

## Product role

Kolosseum Tools is the public utility surface for Kolosseum-adjacent calculators and operational tools. It must feel premium, dark, fast, structured, and direct. It is not the core logged-in Kolosseum platform.

## Routes

| Route | Page | Role | Primary action | Secondary actions |
|---|---|---|---|---|
| `/` | Home | Public landing and tool bay | View tools | Open Event Block |
| `/tools/` | Tool Index | Directory of current public tools | Open a tool | Return home |
| `/tools/ironclock/` | IronClock | Bar loading and rest timer | Calculate/load/run timer | Copy or move to related tool |
| `/tools/event-block-calculator/` | Event Block Calculator | Backwards event-date block planner | Calculate block dates | Copy result |
| `/tools/gym-share/` | Gym Share | Generate public gym text and QR print asset | Generate share text | Copy text, print QR |
| `/tools/session-log/` | Session Log | Local factual session notes | Record session entry | Copy latest entry |
| `/tools/meet-planner/` | Meet Planner | Meet-day date planner | Calculate key meet dates | Copy result |
| `/tools/load-sheet/` | Load Sheet | Equipment and work-item load sheet | Generate load sheet | Copy/export result |

## Global exclusions

These must not appear on public utility pages unless a page wireframe explicitly overrides this:

- Decorative dashboard previews.
- Decorative status cards that consume functional layout width.
- Duplicate side “Other Tools” cards when the shared related-tools rail exists.
- Multiple competing CTAs for the same action.
- Inline JavaScript where external JS can be used.
- External dependencies for critical tool functions unless explicitly documented.

## Shared global layout

All pages use:

1. Header.
2. Page hero.
3. Primary page content.
4. Optional related tools rail.
5. Footer only when needed.

## Responsive targets

| Target | Width behaviour |
|---|---|
| Desktop | Full content width, high spacing discipline, no wasted right column unless functional. |
| Half-screen desktop | Two-column content only if the panel remains readable; otherwise stack. |
| Tablet | Primary action above secondary content. Avoid three-column cards. |
| iPhone/Android | Single-column layout, full-width buttons, compact header, no horizontal overflow. |
