import {chromium} from '@playwright/test';
import fs from 'node:fs';

const origin = 'http://127.0.0.1:6111';
const out = '/tmp/tour-shots';
fs.mkdirSync(out, {recursive: true});

const browser = await chromium.launch();
const results = [];

async function open(context, story, theme, mode) {
  const page = await context.newPage();
  await page.goto(
    `${origin}/iframe.html?id=core-tour--${story}&viewMode=story&globals=astryxTheme:${theme};colorMode:${mode}`,
  );
  await page.getByRole('button', {name: 'Start tour'}).click();
  await page.getByRole('dialog').waitFor();
  await page.waitForTimeout(400);
  return page;
}

async function toRgb(page, color) {
  return page.evaluate(value => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 1, 1);
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
  }, color);
}

function luminance([r, g, b]) {
  const f = v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

async function measure(page, label) {
  const raw = await page.evaluate(() => {
    const css = (el, prop) => getComputedStyle(el).getPropertyValue(prop);
    const ring = document.querySelector('.astryx-tour-highlight');
    const surface = document.querySelector('.astryx-tour');
    const dialog = document.querySelector('[role="dialog"]');
    const heading = dialog.querySelector('h4');
    const texts = [...dialog.querySelectorAll('.astryx-text')];
    const buttons = [...dialog.querySelectorAll('button')];
    // The page color behind the ring: the nearest painted ancestor of the anchor.
    const anchor = [...document.querySelectorAll('button')].find(b => b.textContent === 'Save');
    let behind = 'rgb(255, 255, 255)';
    for (let el = anchor?.parentElement; el; el = el.parentElement) {
      const bg = css(el, 'background-color');
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        behind = bg;
        break;
      }
    }
    return {
      ringShadow: ring ? css(ring, 'box-shadow') : null,
      surfaceBg: css(surface, 'background-color'),
      heading: css(heading, 'color'),
      texts: texts.map(t => [t.textContent.slice(0, 24), css(t, 'color')]),
      buttons: buttons.map(b => [
        b.getAttribute('aria-label') ?? b.textContent,
        css(b, 'color'),
        css(b, 'background-color'),
      ]),
      behind,
    };
  });
  const surfaceBg = await toRgb(page, raw.surfaceBg);
  const behind = await toRgb(page, raw.behind);
  const row = {label, surfaceBg, behind};
  if (raw.ringShadow) {
    const colors = raw.ringShadow.match(/(rgba?\([^)]*\)|oklch\([^)]*\)|color\([^)]*\)|#[0-9a-f]+)/gi) ?? [];
    row.ringColors = [];
    for (const c of colors) row.ringColors.push(await toRgb(page, c));
    if (row.ringColors.length >= 2) {
      row.ringVsGap = ratio(row.ringColors[1], row.ringColors[0]);
      row.ringVsPage = ratio(row.ringColors[1], behind);
    }
  }
  row.heading = ratio(await toRgb(page, raw.heading), surfaceBg);
  row.texts = [];
  for (const [text, color] of raw.texts) row.texts.push([text, ratio(await toRgb(page, color), surfaceBg)]);
  row.buttons = [];
  for (const [name, color, bg] of raw.buttons) {
    const bgRgb = bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent' ? surfaceBg : await toRgb(page, bg);
    row.buttons.push([name, ratio(await toRgb(page, color), bgRgb)]);
  }
  results.push(row);
}

const combos = [
  ['neutral', 'light'],
  ['neutral', 'dark'],
  ['stone', 'light'],
  ['stone', 'dark'],
];

for (const [theme, mode] of combos) {
  const context = await browser.newContext({viewport: {width: 900, height: 520}});
  const tag = `${theme}-${mode}`;
  let page = await open(context, 'default', theme, mode);
  await page.screenshot({path: `${out}/first-step__${tag}.png`});
  await measure(page, `first-step ${tag}`);
  await page.getByRole('button', {name: 'Next'}).click();
  await page.waitForTimeout(400);
  await page.screenshot({path: `${out}/middle-step__${tag}.png`});
  await page.getByRole('button', {name: 'Next'}).click();
  await page.waitForTimeout(400);
  await page.screenshot({path: `${out}/last-step__${tag}.png`});
  await measure(page, `last-step ${tag}`);
  // Keyboard focus on a control, for the focus ring.
  await page.keyboard.press('Tab');
  await page.waitForTimeout(200);
  await page.screenshot({path: `${out}/focus-visible__${tag}.png`});
  await page.close();

  page = await open(context, 'with-backdrop', theme, mode);
  await page.screenshot({path: `${out}/backdrop__${tag}.png`});
  await page.close();

  page = await open(context, 'centered-step', theme, mode);
  await page.screenshot({path: `${out}/centered__${tag}.png`});
  await page.close();
  await context.close();
}

// Narrow viewport and a touch pointer.
{
  const context = await browser.newContext({
    viewport: {width: 390, height: 700},
    hasTouch: true,
    isMobile: true,
  });
  for (const story of ['default', 'with-backdrop', 'centered-step']) {
    const page = await context.newPage();
    await page.goto(`${origin}/iframe.html?id=core-tour--${story}&viewMode=story&globals=astryxTheme:neutral;colorMode:light`);
    await page.getByRole('button', {name: 'Start tour'}).tap();
    await page.getByRole('dialog').waitFor();
    await page.waitForTimeout(400);
    await page.screenshot({path: `${out}/narrow-touch-${story}__neutral-light.png`});
    if (story === 'default') {
      await page.getByRole('button', {name: 'Next'}).tap();
      await page.waitForTimeout(400);
      const name = await page.getByRole('dialog').getAttribute('aria-labelledby');
      results.push({label: 'touch: Next by tap moves the step', ok: (await page.getByRole('dialog').textContent()).includes('Share it'), name: name != null});
    }
    await page.close();
  }
  await context.close();
}

// Forced colors.
{
  const context = await browser.newContext({viewport: {width: 900, height: 520}, forcedColors: 'active'});
  const page = await open(context, 'default', 'neutral', 'light');
  await page.screenshot({path: `${out}/forced-colors__neutral-light.png`});
  await context.close();
}

fs.writeFileSync(`${out}/contrast.json`, JSON.stringify(results, null, 1));
for (const r of results) console.log(JSON.stringify(r));
await browser.close();
