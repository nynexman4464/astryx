import React from 'react';
import {createRoot} from 'react-dom/client';
import '@astryxdesign/core/astryx.css';
import '@astryxdesign/lab/lab.css';
import {Theme} from '@astryxdesign/core/theme';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {CircularProgress} from '@astryxdesign/lab';
import {neutralTheme} from '@astryxdesign/theme-neutral';
import {butterTheme} from '@astryxdesign/theme-butter';
import {chocolateTheme} from '@astryxdesign/theme-chocolate';
import {gothicTheme} from '@astryxdesign/theme-gothic';
import {matchaTheme} from '@astryxdesign/theme-matcha';
import {stoneTheme} from '@astryxdesign/theme-stone';
import {y2kTheme} from '@astryxdesign/theme-y2k';
const themes: Record<string, unknown> = {default: null, neutral: neutralTheme, butter: butterTheme, chocolate: chocolateTheme, gothic: gothicTheme, matcha: matchaTheme, stone: stoneTheme, y2k: y2kTheme};
const q = new URLSearchParams(location.search);
const mode = (q.get('mode') ?? 'light') as 'light' | 'dark';
const only = q.get('theme');
function Wrap({theme, children}: {theme: unknown; children: React.ReactNode}) {
  return theme == null ? <div style={{colorScheme: mode}}>{children}</div> : <Theme theme={theme as never} mode={mode}>{children}</Theme>;
}
const variants = ['accent', 'success', 'warning', 'error', 'neutral', 'disabled'] as const;
const p = (v: string) => (v === 'disabled' ? {isDisabled: true} : {variant: v as 'accent'});
createRoot(document.getElementById('root')!).render(
  <div>
    {Object.entries(themes).filter(([n]) => !only || n === only).map(([name, theme]) => (
      <Wrap key={name} theme={theme}>
        <div data-theme-name={name} style={{padding: 16, width: 640, background: 'var(--color-background-surface)', color: 'var(--color-text-primary)', font: '13px system-ui'}}>
          <div style={{fontWeight: 600, marginBottom: 8}}>{name} · {mode}</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
            {variants.map(v => (
              <div key={v} data-pb={v}><ProgressBar value={65} label={v} {...p(v)} marks={[{value: 30, label: 'Goal'}]} /></div>
            ))}
          </div>
          <div style={{display: 'flex', gap: 18, marginTop: 12}}>
            {variants.map(v => (
              <div key={v} data-cp={v} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
                <CircularProgress value={65} label={v} {...p(v)} /><span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </Wrap>
    ))}
  </div>,
);
