// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file icons.tsx
 * @input IconRegistry type
 * @output Exports windows98IconRegistry for the Windows 98 theme
 * @position Icon configuration for the Windows 98 theme; consumed by
 *   windows98Theme.ts and re-exported from source.ts
 *
 * Original artwork on a 16-unit grid, the size of a Win9x small icon. The
 * shapes follow period conventions rather than copying system artwork:
 * drop-downs and scroll buttons use solid triangles, not chevrons; the close
 * glyph is the heavy caption-button cross; status icons echo the message-box
 * shapes. Everything paints in currentColor so the theme's icon colours apply.
 */

import React, {type ReactNode} from 'react';
import type {IconRegistry} from '@astryxdesign/core/Icon';

/** Outline strokes: square-ended and mitred, like the period's hard edges. */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'butt',
  strokeLinejoin: 'miter',
} as const;

function Glyph({children}: {children: ReactNode}) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true">
      {children}
    </svg>
  );
}

const statusCircle = <circle cx="8" cy="8" r="6.25" {...stroke} />;

export const windows98IconRegistry: IconRegistry = {
  close: (
    <Glyph>
      <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" {...stroke} strokeWidth={2} />
    </Glyph>
  ),
  chevronDown: (
    <Glyph>
      <path d="M4 6h8l-4 4z" />
    </Glyph>
  ),
  chevronLeft: (
    <Glyph>
      <path d="M10 4v8L6 8z" />
    </Glyph>
  ),
  chevronRight: (
    <Glyph>
      <path d="M6 4v8l4-4z" />
    </Glyph>
  ),
  chevronsLeft: (
    <Glyph>
      <path d="M7.5 4v8l-4-4zM12.5 4v8l-4-4z" />
    </Glyph>
  ),
  chevronsRight: (
    <Glyph>
      <path d="M3.5 4v8l4-4zM8.5 4v8l4-4z" />
    </Glyph>
  ),
  check: (
    <Glyph>
      <path d="M4 7.5l3 3 5-5.5" {...stroke} strokeWidth={2.5} />
    </Glyph>
  ),
  success: (
    <Glyph>
      {statusCircle}
      <path d="M5 8l2 2 4-4.25" {...stroke} strokeWidth={2} />
    </Glyph>
  ),
  error: (
    <Glyph>
      {statusCircle}
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" {...stroke} strokeWidth={2} />
    </Glyph>
  ),
  warning: (
    <Glyph>
      <path d="M8 1.75l6.5 12.5h-13z" {...stroke} />
      <path d="M7 5.5h2v5H7zM7 11.5h2v1.75H7z" />
    </Glyph>
  ),
  info: (
    <Glyph>
      {statusCircle}
      <path d="M7 4h2v2H7zM6 7h3v4h1v1.25H6V11h1V8.25H6z" />
    </Glyph>
  ),
  calendar: (
    <Glyph>
      <path d="M2.75 2.75h10.5v10.5H2.75z" {...stroke} />
      <path d="M2 2h12v3H2zM4.5 1h1v2h-1zM10.5 1h1v2h-1z" />
      <path d="M4 6.5h1.25v1.25H4zM6.25 6.5H7.5v1.25H6.25zM8.5 6.5h1.25v1.25H8.5zM10.75 6.5H12v1.25h-1.25zM4 9h1.25v1.25H4zM6.25 9H7.5v1.25H6.25zM8.5 9h1.25v1.25H8.5zM10.75 9H12v1.25h-1.25zM4 11.25h1.25v1.25H4zM6.25 11.25H7.5v1.25H6.25z" />
    </Glyph>
  ),
  clock: (
    <Glyph>
      {statusCircle}
      <path d="M8 4.25V8h3" {...stroke} />
    </Glyph>
  ),
  externalLink: (
    <Glyph>
      <path d="M6.5 3.75H2.75v9.5h9.5V9.5" {...stroke} />
      <path d="M7 9l6.25-6.25M9 2.75h4.25V7" {...stroke} />
    </Glyph>
  ),
  menu: (
    <Glyph>
      <path d="M3 3h10v2H3zM3 7h10v2H3zM3 11h10v2H3z" />
    </Glyph>
  ),
  moreHorizontal: (
    <Glyph>
      <path d="M2 7h2v2H2zM7 7h2v2H7zM12 7h2v2h-2z" />
    </Glyph>
  ),
  search: (
    <Glyph>
      <circle cx="6.5" cy="6.5" r="4.25" {...stroke} />
      <path d="M9.75 9.75l4.25 4.25" {...stroke} strokeWidth={2.5} />
    </Glyph>
  ),
  upload: (
    <Glyph>
      <path d="M8 1l4.5 4.5h-3V10h-3V5.5h-3z" />
      <path d="M1.75 10.5v2.75h12.5V10.5" {...stroke} />
    </Glyph>
  ),
  arrowUp: (
    <Glyph>
      <path d="M8 2l5 5h-3v7H6V7H3z" />
    </Glyph>
  ),
  arrowDown: (
    <Glyph>
      <path d="M8 14l5-5h-3V2H6v7H3z" />
    </Glyph>
  ),
  arrowsUpDown: (
    <Glyph>
      <path d="M8 2l4 4H4zM8 14l4-4H4zM7.25 6h1.5v4h-1.5z" />
    </Glyph>
  ),
  funnel: (
    <Glyph>
      <path d="M2 3h12L9 8.5V14H7V8.5z" />
    </Glyph>
  ),
  eyeSlash: (
    <Glyph>
      <path
        d="M1.5 8C3.5 4.75 5.5 3.75 8 3.75s4.5 1 6.5 4.25c-2 3.25-4 4.25-6.5 4.25S3.5 11.25 1.5 8z"
        {...stroke}
      />
      <circle cx="8" cy="8" r="2" />
      <path d="M2.5 13.5l11-11" {...stroke} />
    </Glyph>
  ),
  viewColumns: (
    <Glyph>
      <path
        d="M1.75 2.75h12.5v10.5H1.75zM6 2.75v10.5M10 2.75v10.5"
        {...stroke}
      />
      <path d="M1 2h14v3H1z" />
    </Glyph>
  ),
  copy: (
    <Glyph>
      <path d="M3.75 11.25h-2V1.75h5l2 2" {...stroke} />
      <path
        d="M5.75 4.75h4.75l2.75 2.75v6.75h-7.5zM10.5 4.75V7.5h2.75"
        {...stroke}
      />
    </Glyph>
  ),
  checkDouble: (
    <Glyph>
      <path
        d="M1 8l3 3 5.5-6M6.75 9.25L8.5 11 15 4"
        {...stroke}
        strokeWidth={2}
      />
    </Glyph>
  ),
  wrench: (
    <Glyph>
      <path d="M13.9 4.22A3 3 0 1 1 11.78 2.1" {...stroke} strokeWidth={2.5} />
      <path d="M9 7l-6.5 6.5" {...stroke} strokeWidth={3} />
    </Glyph>
  ),
  stop: (
    <Glyph>
      <path d="M4 4h8v8H4z" />
    </Glyph>
  ),
  microphone: (
    <Glyph>
      <rect x="5.5" y="1" width="5" height="8.5" rx="2.5" />
      <path
        d="M3.25 6.5v1a4.75 4.75 0 0 0 9.5 0v-1M8 12.25V14M5 14.25h6"
        {...stroke}
      />
    </Glyph>
  ),
};
