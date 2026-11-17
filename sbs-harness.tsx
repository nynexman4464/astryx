import React from 'react';
import {createRoot} from 'react-dom/client';
import '@astryxdesign/core/astryx.css';
import '@astryxdesign/lab/lab.css';
import {Theme} from '@astryxdesign/core/theme';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {CircularProgress} from '@astryxdesign/lab';
import {neutralTheme} from '@astryxdesign/theme-neutral';
const q = new URLSearchParams(location.search);
const mode = (q.get('mode') ?? 'light') as 'light' | 'dark';
const which = q.get('theme') ?? 'neutral';
const tag = q.get('tag') ?? '';
const cases = [['accent', {variant: 'accent'}], ['neutral', {variant: 'neutral'}], ['disabled', {isDisabled: true}]] as const;
function Body() {
  return (
    <div id="sheet" style={{padding: 20, width: 560, background: 'var(--color-background-surface)', color: 'var(--color-text-primary)', font: '13px system-ui', colorScheme: mode}}>
      <div style={{fontWeight: 600, marginBottom: 12}}>{tag} · {which === 'neutral' ? 'Theme Neutral' : 'default theme'} · {mode}</div>
      <div style={{display: 'grid', gap: 12}}>
        {cases.map(([name, props]) => (
          <div key={name} data-pb={name}><ProgressBar value={65} label={name} {...(props as object)} /></div>
        ))}
      </div>
      <div style={{display: 'flex', gap: 40, marginTop: 18}}>
        {cases.map(([name, props]) => (
          <div key={name} data-cp={name} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
            <CircularProgress value={65} label={name} size="lg" {...(props as object)} /><span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
createRoot(document.getElementById('root')!).render(
  which === 'neutral' ? <Theme theme={neutralTheme} mode={mode}><Body /></Theme> : <Body />,
);
