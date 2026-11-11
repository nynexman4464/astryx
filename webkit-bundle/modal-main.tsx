import React, {useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import '@astryxdesign/core/astryx.css';
import {Popover} from '@astryxdesign/core/Popover';

function Coachmark() {
  const [isOpen, setIsOpen] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  return (
    <main>
      <button type="button" id="before">Before</button>
      <div ref={targetRef} style={{display: 'inline-flex', gap: 8}}>
        <button type="button" id="target">Highlighted control</button>
      </div>
      <button type="button" id="after">After</button>
      <button type="button" id="start" onClick={() => setIsOpen(true)}>Start</button>
      <Popover anchor={targetRef} isOpen={isOpen} onOpenChange={setIsOpen} isModal={false}
        hasLightDismiss={false} label="Coachmark"
        content={<><button type="button" id="back">Back</button><button type="button" id="next">Next</button></>} />
      <Popover isModal label="Modal" content={<><button type="button" id="m1">M1</button><button type="button" id="m2">M2</button></>}>
        <button type="button" id="modal-trigger">Open modal</button>
      </Popover>
    </main>
  );
}
createRoot(document.getElementById('root')!).render(<Coachmark />);
