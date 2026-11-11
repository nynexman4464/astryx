# Popover anchoring evidence (AST-113)

Real-browser run of `drive.mjs` against `main.tsx` (Vite, `@astryxdesign/core` built from the stack head), Chromium 149 and Firefox 151 via Playwright on Linux; WebKit 26.5 via Playwright on macOS (run from `webkit-bundle/`).

All checks pass in all three engines: non-button cell anchor with no trigger ARIA; function anchor re-resolved while open; an outside press on another row's control vetoed while the popover moves there; hidden (still open) while the anchor is scrolled out of its panel, shown again when it returns; a press elsewhere closes it; rectangle anchor placed at a point inside a scrolling panel and scrolling with it; `returnFocus="anchor"` returning focus to the anchor's control after Escape.
