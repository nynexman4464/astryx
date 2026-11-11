# @astryxdesign/theme-windows98

Windows 98 theme for Astryx: square corners, dense controls, 3D bevels, recessed input fields, dotted keyboard-focus rectangles, and effectively no animation. Light mode is the Windows 98 "Windows Standard" appearance; dark mode is the Windows 9x "Slate" scheme.

The theme prioritises period fidelity over modern design-system conventions.

## Install

```bash
npm install @astryxdesign/theme-windows98
```

## Usage

Wrap your app with `XDSTheme` and pass the theme:

```tsx
import {XDSTheme} from '@astryxdesign/core/theme';
import {windows98Theme} from '@astryxdesign/theme-windows98/built';

function App() {
  return <XDSTheme theme={windows98Theme}>{/* your app */}</XDSTheme>;
}
```

### Import paths

| Path                                      | Use case                                                    |
| ----------------------------------------- | ----------------------------------------------------------- |
| `@astryxdesign/theme-windows98`           | Source build (StyleX compilation via `@astryxdesign/build`) |
| `@astryxdesign/theme-windows98/built`     | Pre-built dist (Tailwind, plain CSS, or no build step)      |
| `@astryxdesign/theme-windows98/theme.css` | Pre-built CSS file (import in your stylesheet)              |

If you're using `@astryxdesign/build` for StyleX source compilation, import from the bare path. Otherwise, use `/built`.

### CSS import

Add the theme CSS to your stylesheet:

```css
@import '@astryxdesign/theme-windows98/theme.css';
```

## Color modes

Astryx's light and dark modes map onto the two classic appearance schemes:

| Astryx mode | Windows scheme   | Desktop   | Face      | Text      |
| ----------- | ---------------- | --------- | --------- | --------- |
| Light       | Windows Standard | `#008080` | `#C0C0C0` | `#000000` |
| Dark        | Slate            | `#414141` | `#9DB9C8` | `#000000` |

**Slate is not a modern dark mode.** It has a dark desktop, but its controls are a light blue-grey with black text, exactly as the original scheme shipped. Treat it as a second light scheme with a dark backdrop rather than an inverted palette.

## Edges

Win9x chrome is drawn with `DrawEdge` and `DrawFrameControl`, which are not the same bevel. The theme keeps all four distinct, since using one for everything is visibly wrong:

| Edge           | Used by                 | Outer top-left | Inner top-left |
| -------------- | ----------------------- | -------------- | -------------- |
| `raised`       | dialogs, popovers, tabs | 3DLIGHT        | 3DHILIGHT      |
| `raisedButton` | push buttons            | 3DHILIGHT      | 3DLIGHT        |
| `sunken`       | fields, lists, tables   | 3DSHADOW       | 3DDKSHADOW     |
| `etched`       | nested panels           | 3DSHADOW       | 3DHILIGHT      |

Window chrome and push buttons differ only in the top-left pair. Bottom-right is 3DDKSHADOW outside, 3DSHADOW inside for both.

Nested cards pick up the etched edge automatically: a card containing another card pins itself raised and publishes the etched edge to its descendants through an inherited custom property.

## Fonts

This theme uses the classic system typefaces:

| Role            | Font          | Fallbacks                                       |
| --------------- | ------------- | ----------------------------------------------- |
| Body / Headings | MS Sans Serif | Microsoft Sans Serif, Tahoma, Arial, sans-serif |
| Code            | Courier New   | Courier, monospace                              |

**These are deliberately not bundled and not loaded from a font CDN.** MS Sans Serif is a proprietary Microsoft face, and the point of the theme is to use whatever the host system has. `astryx theme build` warns that the named fonts are not loaded; for this theme that warning is expected and can be ignored.

On systems without MS Sans Serif the fallback stack resolves to Tahoma or Arial, which is close enough that the layout metrics still hold.
