# Page Wireframe: IronClock

## Route

`/tools/ironclock/`

## Purpose

Calculate bar loading and run a focused work/rest timer.

## Primary action

Calculate available load and start timer.

## Secondary actions

Reset timer, maximise timer, navigate to related tools.

## Page zones

1. Header.
2. Tool hero.
3. Active tool panel.
4. Related tools rail.

## Active tool panel

Sections:

- Target load input.
- Unit selector if present.
- Bar weight selector.
- Collar selector.
- Collapsible available plates on tablet/mobile.
- Closest load result.
- Bar/plate/collar visual.
- Timer controls.

## Plate visual contract

- Bar, collars, and plates must follow the approved legacy visual.
- Display in kg after rounding.
- If input is lb, convert to kg, calculate nearest available kg load using available kg plates, then show kg result.
- State rounding in kg.

## Must not have

- Workflow explainer section unless explicitly requested.
- Large duplicate Other Tools card.
- Horizontal scroll inside the plate visual.

## Related tools

Use shared related-tools rail.

## Responsive

Desktop: active calculator and timer can sit in a structured grid.

Tablet: plate availability can collapse.

Mobile: stack sections, keep timer controls reachable.
