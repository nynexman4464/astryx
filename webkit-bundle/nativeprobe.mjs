import {chromium, firefox, webkit} from 'playwright';
const url = process.argv[2] ?? 'http://localhost:5299/index.html';
const cases = [
  ['auto, showPopover(), Escape', {}, 'escape'],
  ['auto, showPopover(), hidePopover()', {}, 'hide'],
  ['auto, showPopover({source}), Escape', {source: true}, 'escape'],
  ['auto, showPopover({source}), hidePopover()', {source: true}, 'hide'],
  ['auto, popovertarget invoker, Escape', {invoker: true}, 'escape'],
  ['auto, popovertarget invoker, hidePopover()', {invoker: true}, 'hide'],
  ['manual, showPopover(), hidePopover()', {manual: true}, 'hide'],
  ['auto, opener removed while open, Escape', {removeOpener: true}, 'escape'],
  ['auto, opener removed while open, hidePopover()', {removeOpener: true}, 'hide'],
  ['auto, Escape, script moves focus at beforetoggle', {moveAtBeforeToggle: true}, 'escape'],
  ['auto, hidePopover(), script moves focus at beforetoggle', {moveAtBeforeToggle: true}, 'hide'],
  ['auto, popover element removed while open', {}, 'remove'],
  ['auto, pointer click inside, then hidePopover()', {pointer: true}, 'hide'],
  ['dialog showModal, Escape', {dialog: true}, 'escape'],
  ['dialog showModal, close()', {dialog: true}, 'hide'],
  ['dialog showModal, opener removed, close()', {dialog: true, removeOpener: true}, 'hide'],
];
const engines = [['chromium', chromium], ['firefox', firefox], ['webkit', webkit]];
for (const [name, engine] of engines) {
  let b; try { b = await engine.launch(); } catch (e) { console.log(`SKIP ${name}`); continue; }
  const p = await b.newPage();
  await p.goto(url);
  console.log(`== ${name} ${await p.evaluate(() => navigator.userAgent)}`);
  for (const [label, c, how] of cases) {
    const {before} = await p.evaluate(c => window.runCase(c), c);
    if (c.pointer) await p.click('#inner');
    if (how === 'escape') await p.keyboard.press('Escape');
    const after = await p.evaluate(h => window.closeVia(h), how);
    console.log(`${label.padEnd(58)} focus before close: ${before}  after: ${after}`);
  }
  await b.close();
}
