# Page Wireframe: Gym Share

## Route

`/tools/gym-share/`

## Purpose

Generate a clean public gym information text block and a printable QR asset.

## Primary action

Generate Share Text.

## Secondary actions

Copy Share Text. Print QR.

## Page zones

1. Header.
2. Tool hero.
3. Full-width active tool panel.
4. QR print panel, hidden until print.
5. Related tools rail.

## Active tool panel

Left/form column:

- Gym name.
- Location.
- Public note.
- Generate Share Text button.

Right/result column:

- Waiting/ready state.
- Generated text output.
- Visible QR preview.
- Copy Share Text button.
- Print QR button.

## QR rules

Visible QR preview must appear on the page after valid input.

Print QR must use the same payload as the generated output.

Preferred implementation: local QR generation in external JS.

Temporary implementation: external QR image service is acceptable only if CSP allows the image host and the loading state is tested.

## Must not have

- Decorative Tool Status card.
- Side Other Tools card.
- Inline JavaScript.
- Broken image placeholder before a QR is ready.

## Responsive

Desktop: form column 300px to 420px; result column fills remaining width.

Tablet/mobile: stack form then result; full-width buttons; QR below output.
