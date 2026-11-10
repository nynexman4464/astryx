import React, {useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import '@astryxdesign/core/astryx.css';
import {Popover} from '@astryxdesign/core/Popover';
import type {PopoverRectAnchor} from '@astryxdesign/core/Popover';

function CellAnchor() {
  const cellRef = useRef<HTMLSpanElement>(null);
  return (
    <section>
      <h3>1. Anchor is a non-button cell; trigger is elsewhere</h3>
      <div className="row">
        <span ref={cellRef} className="cell" id="cell">Revenue: 1,204</span>
        <Popover anchor={cellRef} label="Edit revenue" content={<span id="cell-content">Editor for the cell</span>} returnFocus="opener">
          <button type="button" id="cell-trigger">Edit</button>
        </Popover>
      </div>
    </section>
  );
}

function RowSwitch() {
  const [row, setRow] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section>
      <h3>2. Function anchor re-resolves while open; anchor out of view hides; pencil presses veto dismissal</h3>
      <div className="panel" id="rows-panel">
        {Array.from({length: 12}, (_, i) => i + 1).map(n => (
          <div className="row" key={n}>
            <span>Row {n}</span>
            <button type="button" id={`pencil-${n}`} data-pencil={n}
              onClick={() => { setRow(n); setIsOpen(true); }}>✎</button>
          </div>
        ))}
      </div>
      <Popover
        anchor={() => document.querySelector(`[data-pencil="${row}"]`)}
        anchorOutOfView="hide"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onOutsidePress={e => { if (e.target instanceof Element && e.target.closest('[data-pencil]')) e.preventDefault(); }}
        hasAutoFocus={false}
        label="Row editor"
        placement="end"
        content={<span id="row-content">Editing row {row}</span>}
      />
      <button type="button" id="page-button">Somewhere else on the page</button>
    </section>
  );
}

function RectAnchor() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const anchor = useMemo<PopoverRectAnchor>(() => ({
    getBoundingClientRect: () => {
      const p = panelRef.current!.getBoundingClientRect();
      return new DOMRect(p.left + 120, p.top + 60, 1, 1);
    },
    get contextElement() { return panelRef.current; },
  }), []);
  return (
    <section>
      <h3>3. Rectangle anchor inside a scrolling panel</h3>
      <div className="panel" id="rect-panel" ref={panelRef}>
        <div style={{height: 600, padding: 8}}>Scrollable content. The popover sits on a point 120,60 inside this panel.</div>
      </div>
      <button type="button" id="rect-open" onClick={() => setIsOpen(true)}>Open at point</button>
      <Popover anchor={anchor} isOpen={isOpen} onOpenChange={setIsOpen} hasAutoFocus={false} label="Point" content={<span id="rect-content">At the point</span>} />
    </section>
  );
}

function AnchorFocusReturn() {
  const headerRef = useRef<HTMLDivElement>(null);
  return (
    <section>
      <h3>4. returnFocus="anchor"</h3>
      <div ref={headerRef} className="row"><button type="button" id="header-button">Column header</button></div>
      <Popover anchor={headerRef} returnFocus="anchor" label="Filter" content={<button type="button" id="apply">Apply</button>}>
        <button type="button" id="filter-trigger">Filter</button>
      </Popover>
    </section>
  );
}

createRoot(document.getElementById('root')!).render(
  <>
    <CellAnchor />
    <RowSwitch />
    <RectAnchor />
    <AnchorFocusReturn />
  </>,
);
