// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * Windows 98 Theme
 *
 * Light mode: Windows 98 "Windows Standard" appearance.
 * Dark mode: Windows 9x "Slate" appearance scheme.
 *
 * The theme intentionally prioritizes period UI fidelity over modern visual
 * conventions: square corners, dense controls, 3D bevels, dotted focus
 * rectangles, recessed input fields, and immediate state changes.
 */

import {
  defineTheme,
  defineSyntaxTheme,
  type TokenValue,
} from '@astryxdesign/core/theme';
import {windows98IconRegistry} from './icons';

const win98Syntax = defineSyntaxTheme({
  name: 'astryx-windows98',
  tokens: {
    keyword: ['#000080', '#558097'],
    string: ['#008000', '#CEDCE3'],
    comment: ['#808080', '#CEDCE3'],
    number: ['#800000', '#FFFFFF'],
    function: ['#000080', '#FFFFFF'],
    type: ['#800080', '#CEDCE3'],
    variable: ['#000000', '#000000'],
    operator: ['#000000', '#000000'],
    constant: ['#800000', '#FFFFFF'],
    tag: ['#000080', '#FFFFFF'],
    attribute: ['#800000', '#CEDCE3'],
    property: ['#008080', '#FFFFFF'],
    punctuation: ['#000000', '#000000'],
    background: ['#FFFFFF', '#FFFFFF'],
  },
});

const localTokens: Record<string, TokenValue> = {
  // Win32 system-colour roles.  Each tuple is [Windows Standard, Slate].
  '--astryx-theme-windows98-desktop': ['#008080', '#414141'],
  '--astryx-theme-windows98-face': ['#C0C0C0', '#9DB9C8'],
  '--astryx-theme-windows98-text': ['#000000', '#000000'],
  '--astryx-theme-windows98-highlight': ['#FFFFFF', '#CEDCE3'],
  // Slate sets 3DLight to the face colour rather than a distinct tint, so its
  // raised edges show a single light line where Windows Standard shows two.
  '--astryx-theme-windows98-light': ['#DFDFDF', '#9DB9C8'],
  '--astryx-theme-windows98-shadow': ['#808080', '#558097'],
  '--astryx-theme-windows98-dark-shadow': ['#000000', '#000000'],
  '--astryx-theme-windows98-window': ['#FFFFFF', '#FFFFFF'],
  '--astryx-theme-windows98-window-text': ['#000000', '#000000'],
  '--astryx-theme-windows98-selection': ['#000080', '#558097'],
  '--astryx-theme-windows98-selection-text': ['#FFFFFF', '#FFFFFF'],
  '--astryx-theme-windows98-active-title': ['#000080', '#558097'],
  '--astryx-theme-windows98-active-title-end': ['#1084D0', '#558097'],
  '--astryx-theme-windows98-title-text': ['#FFFFFF', '#FFFFFF'],
  '--astryx-theme-windows98-inactive-title': ['#808080', '#808080'],
  '--astryx-theme-windows98-inactive-title-end': ['#B5B5B5', '#808080'],
  '--astryx-theme-windows98-inactive-title-text': ['#C0C0C0', '#C0C0C0'],
  // Slate's InfoWindow is white, not the pale yellow Windows Standard uses.
  '--astryx-theme-windows98-tooltip': ['#FFFFE1', '#FFFFFF'],
  '--astryx-theme-windows98-tooltip-text': ['#000000', '#000000'],
};

const face = 'var(--astryx-theme-windows98-face)';
const text = 'var(--astryx-theme-windows98-text)';
const highlight = 'var(--astryx-theme-windows98-highlight)';
const light = 'var(--astryx-theme-windows98-light)';
const shadow = 'var(--astryx-theme-windows98-shadow)';
const darkShadow = 'var(--astryx-theme-windows98-dark-shadow)';
const window = 'var(--astryx-theme-windows98-window)';
const windowText = 'var(--astryx-theme-windows98-window-text)';
const selection = 'var(--astryx-theme-windows98-selection)';
const selectionText = 'var(--astryx-theme-windows98-selection-text)';

// Win9x chrome follows DrawEdge()'s two concentric edges. The ordering matters:
// on a raised edge the muted 3DLIGHT line sits *outside* the bright 3DHILIGHT
// one, not the other way round. Slate uses the same geometry with its
// blue-gray palette.
//
//   EDGE_RAISED  outer: TL 3DLIGHT    BR 3DDKSHADOW
//                inner: TL 3DHILIGHT  BR 3DSHADOW
//   EDGE_SUNKEN  outer: TL 3DSHADOW   BR 3DHILIGHT
//                inner: TL 3DDKSHADOW BR 3DLIGHT
//
// Window chrome (dialogs, popups, tabs) uses DrawEdge(EDGE_RAISED).
const raised =
  `inset -1px -1px 0 ${darkShadow}, ` +
  `inset 1px 1px 0 ${light}, ` +
  `inset -2px -2px 0 ${shadow}, ` +
  `inset 2px 2px 0 ${highlight}`;

// Push buttons are NOT window chrome: DrawFrameControl(DFC_BUTTON) swaps the
// top-left pair, putting the bright 3DHILIGHT on the outside and 3DLIGHT
// within. Verified pixel-for-pixel against a Win98 capture — a caption button
// reads WHITE, LIGHT, FACE inward, where the window frame reads LIGHT, WHITE.
const raisedButton =
  `inset -1px -1px 0 ${darkShadow}, ` +
  `inset 1px 1px 0 ${highlight}, ` +
  `inset -2px -2px 0 ${shadow}, ` +
  `inset 2px 2px 0 ${light}`;

// Single-line raised edge (BDR_RAISEDINNER) for toolbar-weight chrome.
const raisedSimple = `inset -1px -1px 0 ${shadow}, inset 1px 1px 0 ${highlight}`;

const sunken =
  `inset 1px 1px 0 ${shadow}, ` +
  `inset -1px -1px 0 ${highlight}, ` +
  `inset 2px 2px 0 ${darkShadow}, ` +
  `inset -2px -2px 0 ${light}`;

// Group boxes use DrawEdge(EDGE_ETCHED): a sunken outer edge wrapped by a
// raised inner one, which reads as a thin engraved line rather than a recess.
// This is what nests inside a panel — a sunken edge is for fields and lists,
// which sit visibly *below* the surface. Sampled from a Date/Time Properties
// capture: a group box border reads GREY, WHITE where the calendar list beside
// it reads GREY, BLACK, WHITE.
const etched =
  `inset 1px 1px 0 ${shadow}, ` +
  `inset -1px -1px 0 ${highlight}, ` +
  `inset 2px 2px 0 ${highlight}, ` +
  `inset -2px -2px 0 ${shadow}`;

// A pressed push button draws the full sunken edge; the theme pairs this with
// the classic 1px label offset on :active.
const pressed =
  `inset 1px 1px 0 ${shadow}, ` +
  `inset -1px -1px 0 ${highlight}, ` +
  `inset 2px 2px 0 ${darkShadow}, ` +
  `inset -2px -2px 0 ${light}`;

// Disabled text is engraved, not faded: DrawState(DSS_DISABLED) paints the
// label once in 3DHILIGHT offset 1px down-right, then again in 3DSHADOW on
// top. Sampled from native captures of a disabled button and menu item, in
// both schemes. Astryx dims disabled controls with opacity instead, so each
// rule that applies this also restores full opacity.
const embossed = `1px 1px 0 ${highlight}`;
const disabledText = {
  opacity: '1',
  color: shadow,
  '--color-text-primary': shadow,
  '--color-text-secondary': shadow,
  '--color-icon-primary': shadow,
  textShadow: embossed,
};
const isDisabled = ':is(:disabled,[aria-disabled="true"])';

export const windows98Theme = defineTheme({
  name: 'windows98',
  localTokens,
  icons: windows98IconRegistry,

  typography: {
    scale: {base: 12, ratio: 1.125},
    body: {
      family: 'MS Sans Serif',
      fallbacks: '"Microsoft Sans Serif", Tahoma, Arial, sans-serif',
    },
    heading: {
      family: 'MS Sans Serif',
      fallbacks: '"Microsoft Sans Serif", Tahoma, Arial, sans-serif',
      weight: 'bold',
    },
    code: {
      family: 'Courier New',
      fallbacks: 'Courier, monospace',
    },
  },

  radius: {base: 0, multiplier: 0},

  // Win9x UI state changes are effectively immediate.
  motion: {fast: 1, medium: 1, slow: 1, ratio: 1},

  syntax: win98Syntax,

  tokens: {
    // Dense 4px-ish system metric rhythm.
    '--spacing-0-5': '2px',
    '--spacing-1': '4px',
    '--spacing-1-5': '6px',
    '--spacing-2': '8px',
    '--spacing-3': '12px',
    '--spacing-4': '16px',
    '--spacing-5': '20px',
    '--spacing-6': '24px',
    '--spacing-7': '28px',
    '--spacing-8': '32px',

    // Win9x control metrics: a standard button is ~23px and an edit field
    // ~21px, both far tighter than a modern 26px default.
    '--size-element-sm': '19px',
    '--size-element-md': '22px',
    '--size-element-lg': '26px',

    // Map Astryx semantic surfaces onto classic Win32 system colours.
    '--color-background-body': 'var(--astryx-theme-windows98-desktop)',
    '--color-background-surface': 'var(--astryx-theme-windows98-face)',
    '--color-background-card': 'var(--astryx-theme-windows98-face)',
    '--color-background-popover': 'var(--astryx-theme-windows98-face)',
    '--color-background-muted': 'var(--astryx-theme-windows98-face)',
    '--color-background-inverted': 'var(--astryx-theme-windows98-window)',

    '--color-text-primary': 'var(--astryx-theme-windows98-text)',
    '--color-text-secondary': 'var(--astryx-theme-windows98-text)',
    '--color-text-disabled': 'var(--astryx-theme-windows98-shadow)',
    // Accent text and icons follow --color-accent, which media surfaces
    // (text over photos) re-declare to the on-dark or on-light colour.
    '--color-text-accent': 'var(--color-accent)',

    '--color-icon-primary': 'var(--astryx-theme-windows98-text)',
    '--color-icon-secondary': 'var(--astryx-theme-windows98-text)',
    '--color-icon-disabled': 'var(--astryx-theme-windows98-shadow)',
    '--color-icon-accent': 'var(--color-accent)',

    '--color-accent': 'var(--astryx-theme-windows98-selection)',
    '--color-on-dark': '#FFFFFF',
    '--color-on-light': '#000000',
    '--color-on-accent': 'var(--astryx-theme-windows98-selection-text)',
    '--color-accent-muted': 'var(--astryx-theme-windows98-face)',
    '--color-neutral': 'var(--astryx-theme-windows98-face)',

    '--color-border': 'var(--astryx-theme-windows98-shadow)',
    '--color-border-emphasized': 'var(--astryx-theme-windows98-dark-shadow)',
    '--border-width': '1px',

    '--color-overlay': '#00000080',
    '--color-overlay-hover': 'transparent',
    '--color-overlay-pressed': 'transparent',
    '--color-shadow': '#000000',
    '--color-skeleton': 'var(--astryx-theme-windows98-shadow)',

    // Classic keyboard-focus rectangle.
    '--focus-outline-width': '1px',
    '--focus-outline-style': 'dotted',
    '--focus-outline-color': '#000000',
    '--focus-outline-offset': '-4px',

    '--radius-none': '0px',
    '--radius-inner': '0px',
    '--radius-element': '0px',
    '--radius-container': '0px',
    '--radius-page': '0px',
    '--radius-chat': '0px',
    '--radius-full': '0px',

    // Astryx elevation maps to the same hard-edged Win9x chrome rather than
    // modern blurred drop shadows.
    '--shadow-low': raisedSimple,
    '--shadow-med': raised,
    '--shadow-high': raised,
    '--shadow-inset-hover': 'none',
    '--shadow-inset-selected': sunken,
    '--shadow-inset-success': sunken,
    '--shadow-inset-warning': sunken,
    '--shadow-inset-error': sunken,

    '--text-supporting-size': '0.6875rem',
    // Win9x field captions sit a step below body text.
    '--text-label-size': '0.6875rem',
  },

  components: {
    button: {
      base: {
        borderRadius: '0px',
        borderStyle: 'none',
        backgroundColor: face,
        color: text,
        boxShadow: raisedButton,
        fontWeight: 'var(--font-weight-normal)',
        '--button-focus-offset': '-4px',
        ':hover': {
          backgroundColor: face,
        },
        ':active': {
          boxShadow: pressed,
          transform: 'translate(1px, 1px)',
        },
        // A disabled push button keeps its full bevel; only the label changes.
        // That rule lives in each variant below: here it would tie on
        // specificity with the variants' own colour and lose. Icons are SVG,
        // which text-shadow does not reach.
        [`${isDisabled} .astryx-icon`]: {filter: `drop-shadow(${embossed})`},
      },
      'variant:primary': {
        backgroundColor: face,
        color: text,
        // The default button is the one case where Win9x does draw a flat ring
        // outside the bevel — that hard 1px outline is the default indicator.
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: darkShadow,
        boxShadow: raisedButton,
        [isDisabled]: disabledText,
      },
      'variant:secondary': {
        backgroundColor: face,
        color: text,
        [isDisabled]: disabledText,
      },
      'variant:ghost': {
        backgroundColor: face,
        color: text,
        boxShadow: raisedSimple,
        // DialogHeader hardcodes its close control as a ghost button, but a
        // Win9x caption button is a full push button. Match on the close icon
        // it contains: the compiler only supports pseudo-class keys, and :has()
        // is the one that can look *inside* an element. Scoped under the
        // variant so it outranks the flat ghost bevel above.
        ':has(.astryx-dialog-header-close-icon)': {
          boxShadow: raisedButton,
        },
        [isDisabled]: disabledText,
      },
      'variant:destructive': {
        backgroundColor: face,
        color: text,
        borderColor: face,
        boxShadow: raisedButton,
        [isDisabled]: disabledText,
      },
    },

    card: {
      base: {
        backgroundColor: face,
        // The bevel is drawn on an overlay above the card's content rather than
        // as the card's own box-shadow. Inset shadows paint *beneath* content,
        // so an edge-to-edge child (an image in a padding={0} card) would cover
        // the bevel on every side it touched. ::before, not ::after:
        // SelectableCard paints its press overlay on ::after.
        position: 'relative',
        isolation: 'isolate',
        boxShadow: 'none',
        // The bevel is the border. Core's default 1px card border would draw a
        // flat grey ring outside it, which no Win9x panel has.
        borderStyle: 'none',
        '::before': {
          content: '""',
          position: 'absolute',
          inset: '0',
          zIndex: '1',
          pointerEvents: 'none',
          // Outer panels are raised, panels nested inside one are etched. A
          // descendant test such as :is(.astryx-card *) would also match cards
          // outside the theme scope (a host page's own card wrapping a themed
          // region), so nesting resolves through the cascade instead: the edge
          // is read from an inherited custom property, raised when unset.
          boxShadow: `var(--astryx-theme-windows98-card-edge, ${raised})`,
        },
        // A card that contains another card is by definition an outer panel.
        // It publishes the etched edge to everything beneath it and pins its
        // own overlay back to raised. The property lives in the theme's own
        // namespace: themes may not set private (--_*) properties. These must
        // sit inside a style block: at a target's top level the compiler
        // parses keys as visual props, not selectors.
        ':has(.astryx-card)': {
          '--astryx-theme-windows98-card-edge': etched,
        },
        ':has(.astryx-card)::before': {
          boxShadow: raised,
        },
      },
      'variant:transparent': {
        backgroundColor: 'transparent',
        '::before': {
          boxShadow: 'none',
        },
      },
    },

    // A disabled edit control keeps its sunken edge and drops to the face
    // colour with GrayText, unembossed. Astryx's opacity fade is undone so the
    // surface behind does not show through.
    'text-input': {
      base: {
        borderRadius: '0px',
        borderStyle: 'none',
        backgroundColor: window,
        color: windowText,
        boxShadow: sunken,
      },
      disabled: {
        opacity: '1',
        backgroundColor: face,
        color: shadow,
        // The inner <input> paints from the token, not the wrapper's colour.
        '--color-text-primary': shadow,
      },
    },
    // The composer's typing surface is transparent by default, so it inherits
    // the grey card behind it. In Win9x anything you type into is a recessed
    // white edit control — the surrounding composer chrome stays on the face.
    'chat-composer-input': {
      base: {
        borderRadius: '0px',
        borderStyle: 'none',
        backgroundColor: window,
        color: windowText,
        boxShadow: sunken,
        // The editable text and its placeholder are separate layers, and both
        // inset themselves by --spacing-1. Padding this element would move only
        // the text (the placeholder is absolutely positioned), so the inset is
        // widened through the token instead, matching a text-input's 8px.
        '--spacing-1': '8px',
      },
    },
    // Period chat clients (WinPopup, IRC, Messenger) show the conversation in a
    // recessed white text area rather than on the window face.
    'chat-message-list': {
      base: {
        backgroundColor: window,
        boxShadow: sunken,
      },
    },
    // Without this the sent-message bubble is painted in the face colour and
    // vanishes into the panel, leaving alignment as the only cue to who spoke.
    // A Win9x info tip (pale yellow, flat 1px black border) is the period
    // surface for a short note; the selection colour would read as "selected"
    // and a recessed field as "editable".
    'chat-message-bubble': {
      'sender:user': {
        backgroundColor: 'var(--astryx-theme-windows98-tooltip)',
        color: 'var(--astryx-theme-windows98-tooltip-text)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: darkShadow,
        boxShadow: 'none',
      },
    },
    // Same recessed edit field as text-input; without this the control falls
    // back to the un-themed default and renders on the grey face.
    'number-input': {
      base: {
        borderRadius: '0px',
        borderStyle: 'none',
        backgroundColor: window,
        color: windowText,
        boxShadow: sunken,
      },
      disabled: {
        opacity: '1',
        backgroundColor: face,
        color: shadow,
        '--color-text-primary': shadow,
      },
    },

    'text-area': {
      base: {
        borderRadius: '0px',
      },
      disabled: {
        opacity: '1',
        color: shadow,
      },
    },
    'text-area-control': {
      base: {
        borderRadius: '0px',
        borderStyle: 'none',
        backgroundColor: window,
        color: windowText,
        boxShadow: sunken,
        // This is the <textarea> itself. A disabled TextArea marks it
        // aria-disabled (and read-only, so it stays focusable) rather than
        // :disabled, so the shared selector matches either.
        [isDisabled]: {
          backgroundColor: face,
          color: shadow,
        },
      },
    },

    selector: {
      base: {
        borderRadius: '0px',
        borderStyle: 'none',
        backgroundColor: window,
        color: windowText,
        boxShadow: sunken,
      },
      'variant:ghost': {
        backgroundColor: face,
        color: text,
        boxShadow: raisedSimple,
      },
      // A disabled combo box is drawn flat in GrayText, like an edit field.
      disabled: {
        opacity: '1',
        backgroundColor: face,
        color: shadow,
      },
    },
    'selector-popup': {
      base: {
        borderRadius: '0px',
        // A combo box drops a *list box*, not a menu: white field background
        // behind a flat 1px border. Menus get the face colour and a bevel;
        // lists do not.
        //
        // The popup element also carries .astryx-popover, which this theme
        // paints with the face colour. Both are single-class selectors, so
        // without the :is() bump the winner would depend on which block comes
        // later in this file.
        ':is(.astryx-popover)': {
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: darkShadow,
          backgroundColor: window,
          color: windowText,
          boxShadow: 'none',
        },
      },
    },
    'selector-option-row': {
      base: {
        borderRadius: '0px',
        // The highlight tracks the pointer in a Win9x drop-down list, so
        // hover and selection share one treatment. The row's own `color` does
        // not reach the label — an inner span paints itself from the text
        // tokens — so those are redefined here and inherited downward.
        ':hover': {
          backgroundColor: selection,
          color: selectionText,
          '--color-text-primary': selectionText,
          '--color-text-secondary': selectionText,
        },
      },
      selected: {
        backgroundColor: selection,
        color: selectionText,
        '--color-text-primary': selectionText,
        '--color-text-secondary': selectionText,
      },
    },

    // FieldLabel already turns grey through --color-text-disabled but exposes
    // no disabled state of its own, so the highlight half of the emboss is set
    // on the wrapper that does know, and inherited down to the label.
    'checkbox-input': {
      base: {
        ':has(input:is(:disabled,[aria-disabled="true"]))': {
          textShadow: embossed,
        },
      },
    },
    'switch-field': {
      base: {
        ':has(input:is(:disabled,[aria-disabled="true"]))': {
          textShadow: embossed,
        },
      },
    },
    // A stand-alone field label sits beside its control rather than around it.
    // Radio rows are excluded so one disabled option does not engrave its
    // group's caption. A disabled RadioList marks each row rather than the
    // group, so the second selector looks for a group with no enabled rows;
    // it is written from the field because :has() cannot nest.
    'field-label': {
      base: {
        ':is(:has(~ * > [data-disabled]:not(.astryx-item)), .astryx-field:has(> [role="radiogroup"]):not(:has(> [role="radiogroup"] > :not([aria-disabled="true"]))) > *)':
          {textShadow: embossed},
      },
    },

    'checkbox-indicator': {
      base: {
        borderRadius: '0px',
        borderStyle: 'none',
        backgroundColor: window,
        color: windowText,
        boxShadow: sunken,
        // A Win9x checkbox is a 13x13 box, not a 24px modern control.
        width: '13px',
        height: '13px',
        minWidth: '13px',
        minHeight: '13px',
      },
      checked: {
        backgroundColor: window,
        color: windowText,
      },
      // Win9x greys the tick and drops the box to the face colour, at full
      // strength rather than faded.
      disabled: {
        opacity: '1',
        backgroundColor: face,
        color: shadow,
        // The tick paints from this token, so redefining it greys the tick.
        '--astryx-theme-windows98-window-text': shadow,
      },
    },
    // Astryx fills the box with the accent and paints a white tick. Win9x keeps
    // the box white, so the tick has to flip to black or it disappears.
    'checkbox-indicator-check': {
      base: {
        color: windowText,
        width: '9px',
        height: '9px',
      },
    },
    'checkbox-indicator-dash': {
      base: {
        color: windowText,
      },
    },

    'radio-indicator': {
      base: {
        backgroundColor: window,
        color: windowText,
        // Radios are the one control Win9x does not square off. The theme
        // zeroes every radius token (including --radius-full) because square
        // corners are the rule everywhere else, so the circle is restored
        // here rather than by un-squaring that token for badges and pills too.
        borderRadius: '50%',
        width: '12px',
        height: '12px',
        minWidth: '12px',
        minHeight: '12px',
        // Two-tone border arcs, not the shared `sunken` insets: on a circle an
        // offset inset shadow paints a thick crescent instead of a thin edge,
        // because the offset has no straight run to hug. Border sides render
        // as four arcs and stay crisp. Order is top/right/bottom/left, so the
        // shadow falls top-left and the highlight bottom-right.
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: `${shadow} ${highlight} ${highlight} ${shadow}`,
        boxShadow: 'none',
      },
      checked: {
        backgroundColor: window,
      },
      disabled: {
        opacity: '1',
        backgroundColor: face,
        color: shadow,
        '--astryx-theme-windows98-window-text': shadow,
      },
    },
    'radio-indicator-dot': {
      base: {
        backgroundColor: windowText,
        // The dot has to be re-rounded for the same reason as the indicator.
        borderRadius: '50%',
        width: '4px',
        height: '4px',
      },
    },

    switch: {
      base: {
        borderRadius: '0px',
        borderStyle: 'none',
        backgroundColor: window,
        boxShadow: sunken,
      },
      checked: {
        backgroundColor: selection,
      },
      disabled: {
        opacity: '1',
        backgroundColor: face,
      },
    },
    'switch-thumb': {
      base: {
        borderRadius: '0px',
        backgroundColor: face,
        boxShadow: raisedSimple,
      },
    },

    'tab-list': {
      base: {
        backgroundColor: 'transparent',
      },
    },
    'tab-strip': {
      base: {
        gap: '2px',
      },
    },
    tab: {
      base: {
        borderRadius: '0px',
        borderStyle: 'none',
        backgroundColor: face,
        color: text,
        boxShadow: raisedSimple,
      },
      selected: {
        backgroundColor: face,
        color: text,
        boxShadow: raised,
        transform: 'translateY(1px)',
      },
    },
    'tab-indicator': {
      base: {
        display: 'none',
      },
    },

    dialog: {
      base: {
        borderRadius: '0px',
        borderStyle: 'none',
        backgroundColor: face,
        color: text,
        boxShadow: raised,
        padding: 'var(--spacing-1)',
        // Layout pads each region with --spacing-4 (16px) by default, which is
        // far too airy for Win9x. Collapse it; the title bar in particular sat
        // inside a 16px gutter.
        '--layout-padding-outer-x': 'var(--spacing-1)',
        '--layout-padding-outer-y': '2px',
        '--layout-padding-inner-y': 'var(--spacing-1)',
      },
    },
    'dialog-header': {
      base: {
        borderRadius: '0px',
        background:
          'linear-gradient(to right, var(--astryx-theme-windows98-active-title), var(--astryx-theme-windows98-active-title-end))',
        color: 'var(--astryx-theme-windows98-title-text)',
        padding: '3px 2px',
        fontWeight: 'var(--font-weight-bold)',
        // A Win98 caption bar is ~18px: 11px bold white text, small close box.
        // Theme targets cannot select DialogHeader's inner <h2>, and that <h2>
        // sets its own color/size/weight directly — so it never inherits the
        // `color` above. Redefining the tokens it consumes reaches it via the
        // cascade instead.
        '--color-text-primary': 'var(--astryx-theme-windows98-title-text)',
        '--text-heading-2-size': '0.6875rem',
        '--text-heading-2-leading': '1.2',
        '--text-heading-2-weight': 'var(--font-weight-bold)',
        // Close-button box. --spacing-2 also feeds DialogHeader's title
        // centering calc (element-md / 2 - spacing-2 - caption / 2); at 2px
        // that lands within a pixel of zero, so the caption sits centred
        // rather than being pulled above the bar.
        '--size-element-md': '16px',
        '--spacing-2': '2px',
      },
    },
    'dialog-header-close-icon': {
      base: {
        width: '10px',
        height: '10px',
        fontSize: '10px',
      },
    },

    item: {
      base: {
        borderRadius: '0px',
        // A menu highlights the row under the pointer; a plain list of Items
        // does not, and a drop-down row paints its own highlight around the
        // Item it contains. :is() accepts a descendant selector, so this
        // matches only Items inside a menu. Item paints its label from the
        // text tokens rather than `color`, so the row recolours those.
        ':hover:is(.astryx-dropdown-menu *)': {
          backgroundColor: selection,
          '--color-text-primary': selectionText,
          '--color-text-secondary': selectionText,
        },
        // Covers disabled menu items and radio-list rows. Item fades the row
        // and, separately, the inner span holding its label; both are undone.
        [isDisabled]: disabledText,
        [`${isDisabled} span`]: {opacity: '1'},
      },
    },

    link: {
      base: {
        [isDisabled]: {
          ...disabledText,
          // The label is a Text span that paints itself from the accent token.
          '--color-text-accent': shadow,
        },
      },
    },

    popover: {
      base: {
        borderRadius: '0px',
        borderStyle: 'none',
        backgroundColor: face,
        color: text,
        boxShadow: raised,
      },
    },

    tooltip: {
      base: {
        borderRadius: '0px',
        // Unlike the bevelled surfaces, a Win9x tooltip really is a flat 1px
        // black rectangle over pale yellow.
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: darkShadow,
        backgroundColor: 'var(--astryx-theme-windows98-tooltip)',
        color: 'var(--astryx-theme-windows98-tooltip-text)',
        boxShadow: 'none',
        fontSize: '0.6875rem',
      },
    },

    toolbar: {
      base: {
        backgroundColor: face,
        color: text,
        borderRadius: '0px',
      },
    },

    table: {
      base: {
        borderRadius: '0px',
        borderStyle: 'none',
        backgroundColor: window,
        color: windowText,
      },
    },
    'table-scroll-wrapper': {
      base: {
        borderRadius: '0px',
        boxShadow: sunken,
      },
    },
    'table-header': {
      base: {
        backgroundColor: face,
        color: text,
      },
    },
    'table-header-cell': {
      base: {
        backgroundColor: face,
        color: text,
        borderColor: shadow,
        boxShadow: raisedSimple,
        fontWeight: 'var(--font-weight-normal)',
      },
    },
    'table-cell': {
      base: {
        backgroundColor: window,
        color: windowText,
        borderColor: shadow,
      },
    },

    divider: {
      base: {
        borderColor: shadow,
      },
      'variant:strong': {
        borderColor: darkShadow,
      },
    },

    badge: {
      base: {
        borderRadius: '0px',
        borderStyle: 'none',
        backgroundColor: face,
        color: text,
        boxShadow: raisedSimple,
      },
    },

    'progress-bar-track': {
      base: {
        borderRadius: '0px',
        borderStyle: 'none',
        backgroundColor: window,
        boxShadow: sunken,
      },
    },
    'progress-bar-fill': {
      base: {
        borderRadius: '0px',
        backgroundColor: selection,
      },
    },
  },
});
