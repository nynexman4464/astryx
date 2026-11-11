import {chromium, firefox, webkit} from 'playwright';
const url = process.env.URL ?? 'http://localhost:5199/focus-app/';
const results = [];
for (const [name, engine] of [['chromium', chromium], ['firefox', firefox], ['webkit', webkit]]) {
  let browser;
  try { browser = await engine.launch(); } catch { console.log(`SKIP [${name}]`); continue; }
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector('#card-action');
  const active = () => page.evaluate(() => {
    const a = document.activeElement;
    if (!a || a === document.body) return 'BODY';
    return (a.id || a.textContent?.trim()) + (a.matches(':focus-visible') ? ' (ring)' : ' (no ring)');
  });
  const check = async (label, expectStart) => {
    const got = await active();
    const ok = got.startsWith(expectStart);
    results.push(`${ok ? 'PASS' : 'FAIL'} [${name}] ${label} -> ${got}`);
  };
  const wait = ms => page.waitForTimeout(ms);

  // 1. tour by code
  await page.click('#tour-start');
  await page.evaluate(() => document.activeElement?.blur());
  await page.waitForSelector('#tour-next');
  await wait(300);
  await page.keyboard.press('Escape');
  await wait(300);
  await check('tour opened by code, Escape -> anchor control', 'card-action');

  // 2. remounted trigger (keyboard)
  await page.focus('#filter-0');
  await page.keyboard.press('Enter');
  await wait(300);
  await page.keyboard.press('Enter'); // Apply (focused) remounts the trigger
  await wait(200);
  await page.keyboard.press('Escape');
  await wait(300);
  await check('remounted trigger, Escape -> new trigger with ring', 'filter-1 (ring)');

  // 3. focus already outside
  await page.focus('#note-trigger');
  await page.keyboard.press('Enter');
  await wait(300);
  await page.focus('#note-elsewhere');
  await page.evaluate(() => document.querySelector('#note-trigger').click());
  await wait(300);
  await check('focus moved outside, then close -> stays', 'note-elsewhere');

  // 4a. menu -> dialog by keyboard
  const trigger = page.getByRole('button', {name: 'Actions'});
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await wait(300);
  await page.keyboard.press('Enter');
  await page.waitForSelector('#dialog-done');
  await wait(300);
  await page.keyboard.press('Escape');
  await wait(400);
  await check('menu row -> dialog, Escape -> menu trigger with ring', 'Actions (ring)');
  // 4b. menu -> dialog by mouse
  await trigger.click();
  await wait(300);
  await page.getByRole('menuitem', {name: 'Rename'}).click();
  await page.waitForSelector('#dialog-done');
  await wait(300);
  await page.click('#dialog-done');
  await wait(400);
  await check('menu row -> dialog by mouse, Done -> menu trigger, no ring', 'Actions (no ring)');
  // 4c. plain mouse pick returns to trigger
  await trigger.click();
  await wait(300);
  await page.getByRole('menuitem', {name: 'Duplicate'}).click();
  await wait(400);
  await check('mouse pick -> menu trigger, no ring', 'Actions (no ring)');

  // 5. never body
  await page.focus('#delete');
  await page.keyboard.press('Enter');
  await wait(300);
  await page.keyboard.press('Enter'); // Confirm removes the opener
  await wait(200);
  await page.keyboard.press('Escape');
  await wait(300);
  await check('every stand-in gone -> main, never body', 'main');

  await browser.close();
}
console.log(results.join('\n'));
