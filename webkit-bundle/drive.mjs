import {chromium, webkit, firefox} from 'playwright';
import {mkdirSync} from 'node:fs';

const out = process.env.OUT ?? '/tmp/popover-evidence';
mkdirSync(out, {recursive: true});
const results = [];
const check = (engine, name, ok, detail) => results.push({engine, name, ok, detail});

for (const [engineName, engine] of [['chromium', chromium], ['firefox', firefox], ['webkit', webkit]]) {
  let browser;
  try { browser = await engine.launch(); } catch (e) { console.log(`SKIP [${engineName}] cannot launch: ${String(e.message).split('\n')[0]}`); continue; }
  const page = await browser.newPage({viewport: {width: 900, height: 1100}});
  await page.goto(process.env.URL ?? 'http://localhost:5199/');
  await page.waitForSelector('#cell');
  const box = sel => page.evaluate(s => {
    const el = document.querySelector(s);
    if (!el) return null;
    const layer = el.closest('[popover]') ?? el;
    const r = layer.getBoundingClientRect();
    return {top: r.top, left: r.left, bottom: r.bottom, right: r.right, vis: getComputedStyle(layer).visibility, open: layer.matches(':popover-open')};
  }, sel);
  const rect = sel => page.evaluate(s => { const r = document.querySelector(s).getBoundingClientRect(); return {top: r.top, left: r.left, bottom: r.bottom, right: r.right}; }, sel);

  // 1. cell anchor
  await page.click('#cell-trigger');
  await page.waitForTimeout(400);
  const cell = await rect('#cell');
  const cellPop = await box('#cell-content');
  check(engineName, 'cell: popover open and placed below the cell, aligned to its start',
    cellPop?.open && Math.abs(cellPop.left - cell.left) <= 2 && cellPop.top >= cell.bottom - 1 && cellPop.top - cell.bottom < 12,
    {cell, cellPop});
  const cellAria = await page.evaluate(() => ['aria-haspopup', 'aria-expanded'].map(a => document.querySelector('#cell').getAttribute(a)));
  const trigAria = await page.evaluate(() => document.querySelector('#cell-trigger').getAttribute('aria-expanded'));
  check(engineName, 'cell: no trigger ARIA on the anchor; trigger expanded', cellAria.every(v => v == null) && trigAria === 'true', {cellAria, trigAria});
  await page.screenshot({path: `${out}/${engineName}-1-cell-anchor.png`, clip: {x: 0, y: 0, width: 900, height: 140}});
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 2. row switch + veto + hide
  await page.click('#pencil-2');
  await page.waitForTimeout(400);
  const p2 = await rect('#pencil-2');
  const r2 = await box('#row-content');
  check(engineName, 'rows: opens beside pencil 2', r2?.open && Math.abs((r2.top + r2.bottom) / 2 - (p2.top + p2.bottom) / 2) < 20 && r2.left >= p2.right - 1, {p2, r2});
  await page.click('#pencil-4');
  await page.waitForTimeout(400);
  const p4 = await rect('#pencil-4');
  const r4 = await box('#row-content');
  const text = await page.textContent('#row-content');
  check(engineName, 'rows: pencil 4 press is vetoed, popover moves to pencil 4 without closing', r4?.open && text.includes('row 4') && Math.abs((r4.top + r4.bottom) / 2 - (p4.top + p4.bottom) / 2) < 20, {p4, r4, text});
  await page.screenshot({path: `${out}/${engineName}-2-row-switch.png`, clip: {x: 0, y: 130, width: 900, height: 260}});
  await page.evaluate(() => { document.querySelector('#rows-panel').scrollTop = 400; });
  await page.waitForTimeout(500);
  const hidden = await box('#row-content');
  check(engineName, 'rows: hidden (still open) while pencil 4 is scrolled out of the panel', hidden?.open && hidden.vis === 'hidden', hidden);
  await page.screenshot({path: `${out}/${engineName}-3-row-hidden.png`, clip: {x: 0, y: 130, width: 900, height: 260}});
  await page.evaluate(() => { document.querySelector('#rows-panel').scrollTop = 0; });
  await page.waitForTimeout(500);
  const back = await box('#row-content');
  check(engineName, 'rows: shown again in place when it scrolls back', back?.open && back.vis === 'visible', back);
  await page.click('#page-button');
  await page.waitForTimeout(400);
  const closed = await box('#row-content');
  check(engineName, 'rows: a press elsewhere (not vetoed) closes it', closed && !closed.open, closed);

  // 3. rect anchor in scrolling panel
  await page.click('#rect-open');
  await page.waitForTimeout(400);
  const before = await box('#rect-content');
  const panel = await rect('#rect-panel');
  check(engineName, 'rect: popover placed at the point inside the panel', before?.open && Math.abs(before.left - (panel.left + 120)) <= 3 && Math.abs(before.top - (panel.top + 61)) <= 6, {before, panel});
  await page.screenshot({path: `${out}/${engineName}-4-rect-anchor.png`, clip: {x: 0, y: 380, width: 900, height: 260}});
  await page.evaluate(() => { document.querySelector('#rect-panel').scrollTop = 30; });
  await page.waitForTimeout(400);
  const after = await box('#rect-content');
  check(engineName, 'rect: popover scrolls with the panel content (30px up)', after && Math.abs((before.top - after.top) - 30) <= 2, {before, after});
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  await browser.close();
}
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'} [${r.engine}] ${r.name}${r.ok ? '' : ' ' + JSON.stringify(r.detail)}`);
