import {chromium, firefox, webkit} from 'playwright';
const url = process.env.URL ?? 'http://localhost:5199/focus-app/modal.html';
const out = [];
for (const [name, engine] of [['chromium', chromium], ['firefox', firefox], ['webkit', webkit]]) {
  let b; try { b = await engine.launch(); } catch { console.log(`SKIP [${name}]`); continue; }
  const p = await b.newPage();
  await p.goto(url); await p.waitForSelector('#start');
  const id = () => p.evaluate(() => {
    const a = document.activeElement;
    if (!a || a === document.body) return 'BODY';
    if (a.closest('[data-astryx-popover-fallback-close]')) {
      return a.closest('[popover]')?.querySelector('#next') ? 'coachmark-close' : 'modal-close';
    }
    return a.id || a.tagName;
  });
  const open = () => p.evaluate(() => document.querySelector('#next')?.closest('[popover]')?.matches(':popover-open'));
  const ok = (label, cond, got) => out.push(`${cond ? 'PASS' : 'FAIL'} [${name}] ${label} -> ${JSON.stringify(got)}`);
  await p.focus('#start'); await p.keyboard.press('Enter'); await p.waitForTimeout(400);
  ok('non-modal opens with focus inside', (await id()) === 'back', await id());
  const seq = [];
  for (let i = 0; i < 3; i++) { await p.keyboard.press('Tab'); await p.waitForTimeout(50); seq.push(await id()); }
  ok('Tab moves past the coachmark into the page, never wrapping to Back', !seq.includes('back') && seq.some(s => !['next', 'coachmark-close'].includes(s)), seq);
  await p.focus('#target'); await p.keyboard.press('Tab'); await p.waitForTimeout(100);
  const fromTarget = await id();
  ok('Tab from the highlighted control (anchor) reaches the coachmark or the next page control, no trap', fromTarget === 'back' || fromTarget === 'after', fromTarget);
  await p.focus('#before'); await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  ok('Escape with focus elsewhere leaves it open', await open(), await open());
  await p.focus('#target'); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  ok('Escape on the anchor closes it', !(await open()), await open());
  await p.focus('#modal-trigger'); await p.keyboard.press('Enter'); await p.waitForTimeout(400);
  const mseq = [];
  for (let i = 0; i < 4; i++) { await p.keyboard.press('Tab'); await p.waitForTimeout(50); mseq.push(await id()); }
  ok('modal popover holds Tab: M2, its close control, then back to M1', mseq.every(s => ['m1', 'm2', 'modal-close'].includes(s)) && mseq.includes('m1'), mseq);
  const am = await p.evaluate(() => document.querySelector('#m1')?.closest('[role=dialog]')?.getAttribute('aria-modal'));
  ok('modal popover carries aria-modal', am === 'true', am);
  await b.close();
}
console.log(out.join('\n'));
