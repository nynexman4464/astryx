# WebKit evidence bundle: Popover anchoring and native focus restore

Self-contained. Needs Node 18+ and network access to npm. Run from a temp directory on macOS:

```sh
npm install --no-save --no-package-lock      # playwright, local to this folder
npx playwright install webkit                # browser into the per-user Playwright cache
node serve.mjs &                             # http://localhost:5199
URL=http://localhost:5199/app/ OUT=$PWD/shots node drive.mjs
node nativeprobe.mjs http://localhost:5199/native/index.html
node focus-drive.mjs                         # layer focus return (AST-113 FR17–FR21)
node modal-drive.mjs                         # isModal (AST-113 FR12–FR15)
kill %1
```

`drive.mjs` checks, in each engine it can launch: a non-button cell anchor with no trigger ARIA; a function anchor re-resolved while open; an outside press on another row's control vetoed while the popover moves there; hidden (still open) while the anchor is scrolled out of its panel and shown again when it returns; a press elsewhere closes it; a rectangle anchor placed at a point inside a scrolling panel and scrolling with it. Screenshots go to `$OUT`.

`nativeprobe.mjs` prints where each engine's native popover and `<dialog>` focus restore leaves focus (and whether it paints a focus ring) for: auto and manual popovers, Escape and `hidePopover()`, an invoker or `source`, an opener removed while open, the popover removed while open, a pointer click inside before closing, and a script that moves focus at `beforetoggle`.

## Chromium 149 and Firefox 151 results (Linux, headless)

Both engines gave identical results:

| Case | Focus after close |
| --- | --- |
| auto, Escape or `hidePopover()` (with or without invoker/`source`) | opener, with ring |
| manual, `hidePopover()` | body |
| auto, opener removed while open | body |
| auto, popover element removed while open | body |
| auto, pointer click inside, then `hidePopover()` | opener, **with ring** |
| auto, script moves focus at `beforetoggle` | the script's element |
| `<dialog>` `showModal()`, Escape or `close()` | opener, with ring |
| `<dialog>`, opener removed, `close()` | body |

## WebKit 26.5 results (macOS, Playwright WebKit)

`drive.mjs`: all 9 checks pass.

`nativeprobe.mjs` matches Chromium and Firefox in every row but one:

| Case | Chromium, Firefox | WebKit |
| --- | --- | --- |
| auto, pointer click inside, then `hidePopover()` | opener, with ring | body (WebKit does not focus a button on click, so the click blurs focus and there is nothing to restore) |

## Layer focus return (`focus-drive.mjs`, Chromium 149 and Firefox 151)

All 7 checks pass in both engines:

- a tour step opened by code returns focus to its anchor's control on Escape;
- a trigger that remounted while open gets focus back, with a ring after keyboard;
- focus moved outside before close stays where it is;
- a menu row that opens a dialog returns focus to the menu trigger on close, with a ring after keyboard and none after a mouse close;
- a mouse pick returns focus to the menu trigger with no ring;
- with every stand-in gone, focus goes to `main`, never the body.

## isModal (`modal-drive.mjs`, Chromium 149 and Firefox 151)

All 7 checks pass in both engines:

- a non-modal coachmark opens with focus inside;
- Tab moves past its last control into the page and never wraps;
- Tab from the highlighted control is not trapped;
- an Escape pressed elsewhere leaves it open, and an Escape on the anchor closes it;
- a modal popover still holds Tab and carries `aria-modal`.

The engines differ in one place. After the coachmark's last control, Chromium moves to the anchor; Firefox moves to the next control in DOM order.
