# Page Wireframe: Load Sheet

## Route

`/tools/load-sheet/`

## Purpose

Calculate plates per side from target load, bar weight, collars, and available plates.

## Primary action

Generate load sheet.

## Secondary action

Copy/export result.

## Page zones

1. Header.
2. Tool hero.
3. Active tool panel.
4. Related tools rail.

## Active tool panel

Form column:

- Target load.
- Unit selector if needed.
- Bar weight.
- Collar setting.
- Available plates.
- Generate button.

Result column:

- Closest load.
- Rounding note.
- Plates per side.
- Optional bar visual.
- Copy/export button.

## Calculation rules

If lb input is accepted, calculation must still use available kg plates and display final rounded load in kg unless a page spec explicitly says otherwise.

## Must not have

- Conflicting lb/kg output.
- Decorative status card.
- Duplicate related tools card.

## Responsive

Desktop: form left, result right.

Tablet/mobile: collapse available plates, stack result.
