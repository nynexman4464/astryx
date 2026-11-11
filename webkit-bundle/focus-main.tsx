import React, {useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import '@astryxdesign/core/astryx.css';
import {Popover} from '@astryxdesign/core/Popover';
import {Dialog} from '@astryxdesign/core/Dialog';
import {DropdownMenu, DropdownMenuItem} from '@astryxdesign/core/DropdownMenu';

function TourByCode() {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  return (
    <section>
      <h3>1. Tour step opened by code returns focus to its anchor</h3>
      <div ref={cardRef} className="row"><button type="button" id="card-action">Card action</button></div>
      <button type="button" id="tour-start" onClick={() => setTimeout(() => setIsOpen(true), 50)}>Start tour later</button>
      <Popover anchor={cardRef} isOpen={isOpen} onOpenChange={setIsOpen} hasLightDismiss={false} label="Tour step"
        content={<button type="button" id="tour-next">Next</button>} />
    </section>
  );
}

function RemountedTrigger() {
  const [gen, setGen] = useState(0);
  return (
    <section>
      <h3>2. Trigger remounted while open: focus goes to the new trigger</h3>
      <Popover label="Filter" content={<button type="button" id="filter-apply" onClick={() => setGen(g => g + 1)}>Apply</button>}>
        <button type="button" key={gen} id={`filter-${gen}`}>Filter {gen}</button>
      </Popover>
    </section>
  );
}

function NonModalOutside() {
  return (
    <section>
      <h3>3. Focus already outside: nothing moves</h3>
      <div className="row">
        <Popover label="Note" hasLightDismiss={false} content={<button type="button" id="note-inside">Inside</button>}>
          <button type="button" id="note-trigger">Open note</button>
        </Popover>
        <button type="button" id="note-elsewhere">Elsewhere</button>
      </div>
    </section>
  );
}

function MenuToDialog() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section>
      <h3>4. Menu row opens a dialog: closing it returns focus to the menu trigger</h3>
      <DropdownMenu button={{label: 'Actions'}} data-testid="menu">
        <DropdownMenuItem label="Rename" onClick={() => setIsOpen(true)} />
        <DropdownMenuItem label="Duplicate" />
      </DropdownMenu>
      <Dialog isOpen={isOpen} onOpenChange={setIsOpen} aria-label="Rename">
        <button type="button" id="dialog-done" onClick={() => setIsOpen(false)}>Done</button>
      </Dialog>
    </section>
  );
}

function NeverBody() {
  const [shown, setShown] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  return (
    <main id="main" tabIndex={-1}>
      <h3>5. Every stand-in gone: focus goes to main, never the body</h3>
      <div ref={anchorRef} />
      {shown ? <section><button type="button" id="delete" onClick={() => setIsOpen(true)}>Delete</button></section> : null}
      <Popover anchor={anchorRef} isOpen={isOpen} onOpenChange={setIsOpen} label="Confirm"
        content={<button type="button" id="confirm" onClick={() => setShown(false)}>Confirm</button>} />
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <>
    <TourByCode />
    <RemountedTrigger />
    <NonModalOutside />
    <MenuToDialog />
    <NeverBody />
  </>,
);
