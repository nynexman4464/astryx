// Captures the Core/Tour stories from a built Storybook served on
// 127.0.0.1:6111, with a receipt for each frame and the contrast numbers.
// Usage: node tour-shots.mjs <build sha> <out dir>
import {chromium} from '@playwright/test';
import fs from 'node:fs';

const [build = 'unknown', out = '/tmp/tour-shots'] = process.argv.slice(2);
const origin = 'http://127.0.0.1:6111';
fs.mkdirSync(out, {recursive: true});

const browser = await chromium.launch();
const receipts = [];
const contrast = [];

function url(story, {theme = 'neutral', mode = 'light', direction = 'ltr'} = {}) {
  return `${origin}/iframe.html?id=core-tour--${story}&viewMode=story&globals=astryxTheme:${theme};colorMode:${mode};direction:${direction}`;
}

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      document.getAnimations().map(animation => animation.finished.catch(() => {})),
    );
  });
  await page.waitForTimeout(250);
}

async function frame(page, name, expected) {
  await settle(page);
  const errors = page.__errors ?? [];
  const sensed = await page.evaluate(() => {
    const dialog = document.querySelector('.astryx-tour');
    const ring = document.querySelector('.astryx-tour-highlight');
    const overlay = document.querySelector('.astryx-tour-overlay');
    const rect = el => {
      if (el == null) return null;
      const r = el.getBoundingClientRect();
      return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)];
    };
    const title = dialog?.querySelector('h4');
    const root = document.documentElement;
    return {
      story: new URL(location.href).searchParams.get('id'),
      globals: new URL(location.href).searchParams.get('globals'),
      colorScheme: getComputedStyle(root).colorScheme,
      direction: getComputedStyle(dialog ?? document.body).direction,
      viewport: [window.innerWidth, window.innerHeight],
      dpr: window.devicePixelRatio,
      coarsePointer: matchMedia('(pointer: coarse)').matches,
      forcedColors: matchMedia('(forced-colors: active)').matches,
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      dialogName: title?.textContent ?? null,
      ariaModal: dialog?.getAttribute('aria-modal') ?? null,
      ariaBusy: dialog?.getAttribute('aria-busy') ?? null,
      backdrop: overlay?.getAttribute('data-backdrop') ?? null,
      focus: document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent?.slice(0, 30) ?? null,
      callout: rect(dialog),
      ring: rect(ring),
      fontsReady: document.fonts.status,
      runningAnimations: document.getAnimations().filter(a => a.playState === 'running').length,
      horizontalScroll: root.scrollWidth > window.innerWidth,
    };
  });
  const pass = Object.entries(expected).every(
    ([key, value]) => JSON.stringify(sensed[key]) === JSON.stringify(value),
  );
  await page.screenshot({path: `${out}/${name}.png`});
  receipts.push({frame: `${name}.png`, build, expected, sensed, captureErrors: errors, pass: pass && errors.length === 0});
}

async function open(context, story, globals) {
  const page = await context.newPage();
  page.__errors = [];
  page.on('pageerror', error => page.__errors.push(String(error)));
  await page.goto(url(story, globals));
  return page;
}

async function start(page) {
  const starter = page.getByRole('button', {name: 'Start tour'});
  await starter.waitFor();
  if ((await page.locator('.astryx-tour').count()) === 0) {
    if (await page.evaluate(() => matchMedia('(pointer: coarse)').matches)) {
      await starter.tap();
    } else {
      await starter.click();
    }
  }
  await page.locator('.astryx-tour').waitFor();
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
    const heading = surface.querySelector('h4');
    const texts = [...surface.querySelectorAll('.astryx-text')];
    const buttons = [...surface.querySelectorAll('button')];
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
      buttons: buttons.map(b => [b.getAttribute('aria-label') ?? b.textContent, css(b, 'color'), css(b, 'background-color')]),
      behind,
    };
  });
  const surfaceBg = await toRgb(page, raw.surfaceBg);
  const behind = await toRgb(page, raw.behind);
  const row = {label, surfaceBg, behind};
  if (raw.ringShadow) {
    const colors = raw.ringShadow.match(/(rgba?\([^)]*\)|oklch\([^)]*\)|color\([^)]*\)|#[0-9a-f]+)/gi) ?? [];
    const rgb = [];
    for (const c of colors) rgb.push(await toRgb(page, c));
    if (rgb.length >= 2) {
      row.ringVsGap = ratio(rgb[1], rgb[0]);
      row.ringVsPage = ratio(rgb[1], behind);
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
  contrast.push(row);
}

const wide = {viewport: {width: 900, height: 520}};

for (const [theme, mode] of [['neutral', 'light'], ['neutral', 'dark'], ['stone', 'light'], ['stone', 'dark']]) {
  const context = await browser.newContext(wide);
  const tag = `${theme}-${mode}`;
  const base = {colorScheme: mode, direction: 'ltr', viewport: [900, 520]};
  let page = await open(context, 'default', {theme, mode});
  await start(page);
  await frame(page, `first-step__${tag}`, {...base, dialogName: 'Save your work', ariaModal: null, backdrop: null});
  await measure(page, `first-step ${tag}`);
  await page.getByRole('button', {name: 'Next'}).click();
  await frame(page, `middle-step__${tag}`, {...base, dialogName: 'Share it'});
  await page.getByRole('button', {name: 'Next'}).click();
  await frame(page, `last-step__${tag}`, {...base, dialogName: 'Export'});
  await measure(page, `last-step ${tag}`);
  await page.keyboard.press('Tab');
  await frame(page, `focus-visible__${tag}`, {...base, dialogName: 'Export', focus: 'Close tour'});
  await page.close();

  page = await open(context, 'with-backdrop', {theme, mode});
  await start(page);
  await frame(page, `backdrop__${tag}`, {...base, dialogName: 'Save your work', ariaModal: 'true', backdrop: 'backdrop'});
  await page.close();

  page = await open(context, 'centered-step', {theme, mode});
  await start(page);
  await frame(page, `centered__${tag}`, {...base, dialogName: 'Welcome', ring: null});
  await page.close();

  page = await open(context, 'long-text', {theme, mode});
  await start(page);
  await frame(page, `long-text__${tag}`, {...base, horizontalScroll: false});
  await page.close();
  await context.close();
}

// A custom theme, right-to-left, and the steps inside other layers.
{
  const context = await browser.newContext(wide);
  let page = await open(context, 'scoped-theme');
  await page.locator('.astryx-tour').waitFor();
  await frame(page, 'custom-theme__violet-light', {dialogName: 'Save your work'});
  await page.close();

  page = await open(context, 'default', {direction: 'rtl'});
  await start(page);
  await frame(page, 'rtl__neutral-light', {direction: 'rtl', dialogName: 'Save your work'});
  await page.close();

  for (const story of ['inside-layers', 'inside-layers-with-backdrop']) {
    page = await open(context, story);
    await start(page);
    await page.locator('.astryx-tour').getByRole('button', {name: 'Next'}).click();
    await page.getByRole('dialog', {name: 'Apply your changes'}).waitFor();
    await frame(page, `in-dialog__${story}`, {dialogName: 'Apply your changes'});
    await page.locator('.astryx-tour').getByRole('button', {name: 'Next'}).click();
    await page.getByRole('dialog', {name: 'Filter the list'}).waitFor();
    await frame(page, `in-popover__${story}`, {dialogName: 'Filter the list'});
    await page.close();
  }
  await context.close();
}

// A 320-pixel viewport with a coarse pointer.
{
  const context = await browser.newContext({viewport: {width: 320, height: 640}, hasTouch: true, isMobile: true});
  const base = {viewport: [320, 640], coarsePointer: true, horizontalScroll: false};
  for (const [story, name] of [['narrow-container', 'Save your work to the cloud and to this device at the same time'], ['with-backdrop', 'Save your work'], ['centered-step', 'Welcome']]) {
    for (const mode of ['light', 'dark']) {
      const page = await open(context, story, {mode});
      await start(page);
      await frame(page, `narrow-touch-${story}__neutral-${mode}`, {...base, colorScheme: mode, dialogName: name});
      if (story === 'narrow-container' && mode === 'light') {
        await page.locator('.astryx-tour').getByRole('button', {name: 'Next'}).tap();
        await page.getByRole('dialog', {name: 'Share it'}).waitFor();
        await frame(page, `narrow-touch-${story}-step-2__neutral-${mode}`, {...base, dialogName: 'Share it'});
      }
      await page.close();
    }
  }
  await context.close();
}

// Forced colors.
{
  const context = await browser.newContext({...wide, forcedColors: 'active'});
  const page = await open(context, 'default');
  await start(page);
  await frame(page, 'forced-colors__neutral-light', {forcedColors: true, dialogName: 'Save your work'});
  await context.close();
}

fs.writeFileSync(`${out}/contrast.json`, JSON.stringify(contrast, null, 1));
fs.writeFileSync(`${out}/receipts.json`, JSON.stringify(receipts, null, 1));
const failed = receipts.filter(receipt => !receipt.pass);
console.log(`frames: ${receipts.length}; receipts failed: ${failed.length}`);
for (const receipt of failed) {
  console.log('FAILED', receipt.frame, JSON.stringify(receipt.expected), JSON.stringify(receipt.sensed), receipt.captureErrors);
}
await browser.close();
