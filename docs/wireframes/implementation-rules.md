# Implementation Rules

## Change order

For any page change:

1. Confirm or update the page wireframe.
2. Confirm shared component impact.
3. Change HTML structure.
4. Change scoped CSS.
5. Change JavaScript.
6. Run static checks.
7. Commit.

## HTML rules

Use stable classes and IDs. JavaScript must bind to explicit IDs, not guessed selectors.

Avoid inline scripts. Tool behaviour belongs in `assets/js/<tool>.js` unless there is a documented reason.

Do not create layout-only decorative cards that compete with the active tool.

## CSS rules

Page-specific CSS must be scoped by body class, for example `.gym-share-page`.

Shared component CSS belongs in the master/shared layer.

`styles.css` must keep the required master import at the top:

@import url("./assets/css/kolosseum.master.css");

Do not use forbidden commercial wording blocked by `scripts/check-static-site.mjs`.

## JavaScript rules

Each dedicated tool should have one external JS file if it needs behaviour.

No `eval`, `new Function`, string timers, or dynamic script construction.

No remote critical logic.

## QR rules

QR display must be visible before print.

The user should not have to press Print to discover whether the QR works.

If using an image API, CSP and image loading states must be tested. Preferred final state is vendored/local QR generation.
