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
  '--astryx-theme-windows98-tooltip': ['#FFFFE1', '#FFFFE1'],
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

export const windows98Theme = defineTheme({
  name: 'windows98',
  localTokens,

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
    '--color-text-accent': 'var(--astryx-theme-windows98-selection)',

    '--color-icon-primary': 'var(--astryx-theme-windows98-text)',
    '--color-icon-secondary': 'var(--astryx-theme-windows98-text)',
    '--color-icon-disabled': 'var(--astryx-theme-windows98-shadow)',
    '--color-icon-accent': 'var(--astryx-theme-windows98-selection)',

    '--color-accent': 'var(--astryx-theme-windows98-selection)',
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

    '--text-supporting-size': '11px',
    // Win9x field captions sit a step below body text.
    '--text-label-size': '11px',
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
      },
      'variant:secondary': {
        backgroundColor: face,
        color: text,
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
      },
      'variant:destructive': {
        backgroundColor: face,
        color: text,
        borderColor: face,
        boxShadow: raisedButton,
      },
    },

    card: {
      base: {
        backgroundColor: face,
        // Outer panels are raised, panels nested inside one are recessed.
        // Astryx reflects no nesting signal into the DOM and theme targets
        // cannot use a descendant combinator, so this resolves it through the
        // cascade instead: a card reads its edge from an inherited custom
        // property, falling back to raised when no ancestor card has set one.
        boxShadow: `var(--_w98-card-edge, ${raised})`,
        // A card that contains another card is by definition an outer panel.
        // It pins its own edge to raised and publishes the recessed edge to
        // everything beneath it, which is what nested cards pick up above.
        // Must be nested inside a style block: at a target's top level the
        // compiler parses keys as visual props, not selectors.
        ':has(.astryx-card)': {
          boxShadow: raised,
          '--_w98-card-edge': etched,
        },
      },
      'variant:transparent': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    },

    'text-input': {
      base: {
        borderRadius: '0px',
        borderStyle: 'none',
        backgroundColor: window,
        color: windowText,
        boxShadow: sunken,
      },
      disabled: {
        backgroundColor: face,
        color: shadow,
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
        // Keep the caret and text clear of the 2px bevel.
        padding: '3px 4px',
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
        backgroundColor: face,
        color: shadow,
      },
    },

    'text-area': {
      base: {
        borderRadius: '0px',
      },
      disabled: {
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
      disabled: {
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
      disabled: {
        backgroundColor: face,
        color: shadow,
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
        backgroundColor: face,
        color: shadow,
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
        '--text-heading-2-size': '11px',
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

    // A menu highlights the row under the pointer; a plain list of Items does
    // not. Item carries no attribute distinguishing the two and theme targets
    // cannot use a descendant combinator, so the menu publishes the highlight
    // downward and Item reads it, defaulting to no highlight outside a menu.
    'more-menu': {
      base: {
        '--_w98-menu-highlight': selection,
        '--_w98-menu-highlight-text': selectionText,
      },
    },
    item: {
      base: {
        borderRadius: '0px',
        ':hover': {
          backgroundColor: 'var(--_w98-menu-highlight, transparent)',
          // Item paints its label and description from these rather than from
          // `color`, so recolouring the row means setting both.
          '--_item-label-color':
            'var(--_w98-menu-highlight-text, var(--color-text-primary))',
          '--_item-description-color':
            'var(--_w98-menu-highlight-text, var(--color-text-secondary))',
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
        fontSize: '11px',
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
