import {chromium} from 'playwright';
import fs from 'fs';
const label = process.argv[2], port = process.argv[3];
function parse(s){const m=(s.match(/[\d.]+/g)||[]).map(Number);return m.length===3?[...m,1]:m;}
function over(fg,bg){const a=fg[3];return [0,1,2].map(i=>fg[i]*a+bg[i]*(1-a)).concat(1);}
function lum(c){const f=x=>{x/=255;return x<=0.03928?x/12.92:((x+0.055)/1.055)**2.4};return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]);}
function cr(a,b){const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05);}
const b = await chromium.launch(); const page = await b.newPage({viewport:{width:700,height:900},deviceScaleFactor:2});
const rows=[];
for (const mode of ['light','dark']) {
  await page.emulateMedia({colorScheme: mode});
  await page.goto(`http://localhost:${port}/?mode=${mode}`); await page.waitForSelector('[role=progressbar]'); await page.waitForTimeout(1500);
  const data = await page.evaluate(() => {
    const out=[];
    for (const th of document.querySelectorAll('[data-theme-name]')) {
      const surf=getComputedStyle(th).backgroundColor;
      for (const el of th.querySelectorAll('[data-pb]')) {
        const bar=el.querySelector('[role=progressbar]'); const fill=bar.firstElementChild;
        const mark=el.querySelector('[data-placement]');
        out.push({theme:th.dataset.themeName,kind:'ProgressBar',v:el.dataset.pb,surf,track:getComputedStyle(bar).backgroundColor,fill:getComputedStyle(fill).backgroundColor,mark:mark?getComputedStyle(mark).backgroundColor:null,markPlacement:mark?.dataset.placement});
      }
      for (const el of th.querySelectorAll('[data-cp]')) {
        const circles=[...el.querySelectorAll('circle')];
        const visible=[...el.querySelectorAll('circle,path')].map(c=>getComputedStyle(c).stroke);
        out.push({theme:th.dataset.themeName,kind:'CircularProgress',v:el.dataset.cp,surf,track:getComputedStyle(circles[0]).stroke,fill:visible[visible.length-1]});
      }
    }
    return out;
  });
  for (const d of data) {
    // The pulse floor: a fill at 0.84 opacity over the track.
    const s=parse(d.surf); const t=over(parse(d.track),s); const f=over(parse(d.fill),s);
    const fp=parse(d.fill); const fPulse=over([fp[0],fp[1],fp[2],(fp[3]??1)*0.84],t);
    const r={mode,...d,fillVsTrack:+cr(f,t).toFixed(2),pulseVsTrack:+cr(fPulse,t).toFixed(2)};
    if (d.mark && d.markPlacement==='fill') r.markVsFill=+cr(over(parse(d.mark),s),f).toFixed(2);
    rows.push(r);
  }
  for (const th of ['default','neutral','y2k']) {
    await page.locator(`[data-theme-name=${th}]`).screenshot({path:`/tmp/pbshots/${label}-${th}-${mode}.png`});
  }
}
fs.writeFileSync(`/tmp/pbshots/${label}.json`, JSON.stringify(rows,null,1));
await b.close();
const fails=rows.filter(r=>r.fillVsTrack<3);
console.log(label,'rows',rows.length,'below 3:1:',fails.length);
for (const f of fails) console.log(' ',f.mode,f.theme,f.kind,f.v,f.fillVsTrack);
