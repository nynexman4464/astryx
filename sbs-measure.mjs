import {chromium} from 'playwright';
import fs from 'fs';
const label = process.argv[2], port = process.argv[3];
function parse(s){const m=(s.match(/[\d.]+/g)||[]).map(Number);return m.length===3?[...m,1]:m;}
function over(fg,bg,extra=1){const a=(fg[3]??1)*extra;return [0,1,2].map(i=>fg[i]*a+bg[i]*(1-a)).concat(1);}
function lum(c){const f=x=>{x/=255;return x<=0.03928?x/12.92:((x+0.055)/1.055)**2.4};return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]);}
function cr(a,b){const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return +((x+0.05)/(y+0.05)).toFixed(2);}
const b = await chromium.launch(); const page = await b.newPage({viewport:{width:620,height:400},deviceScaleFactor:2});
const out=[];
for (const theme of ['neutral','default']) for (const mode of ['light','dark']) {
  await page.emulateMedia({colorScheme: mode});
  await page.goto(`http://localhost:${port}/?mode=${mode}&theme=${theme}&tag=${label}`); await page.waitForSelector('[role=progressbar]'); await page.waitForTimeout(1500);
  const data = await page.evaluate(() => {
    const r=[]; const sheet=document.getElementById('sheet'); const surf=getComputedStyle(sheet).backgroundColor;
    const opac = el => { let o=1; for (let e=el; e && e!==sheet; e=e.parentElement) o*=parseFloat(getComputedStyle(e).opacity); return o; };
    for (const el of document.querySelectorAll('[data-pb]')) { const bar=el.querySelector('[role=progressbar]'); const fill=bar.firstElementChild;
      r.push({kind:'ProgressBar',v:el.dataset.pb,surf,track:getComputedStyle(bar).backgroundColor,fill:getComputedStyle(fill).backgroundColor,op:opac(bar)}); }
    for (const el of document.querySelectorAll('[data-cp]')) { const c=[...el.querySelectorAll('circle,path')];
      r.push({kind:'CircularProgress',v:el.dataset.cp,surf,track:getComputedStyle(c[0]).stroke,fill:getComputedStyle(c[c.length-1]).stroke,op:opac(c[0])}); }
    return r; });
  for (const d of data) {
    const s=parse(d.surf); const t=over(parse(d.track),s,d.op); const f=over(parse(d.fill),s,d.op);
    out.push({label,theme,mode,kind:d.kind,v:d.v,opacity:d.op,fillVsTrack:cr(f,t),fillVsSurface:cr(f,s)});
  }
  await page.locator('#sheet').screenshot({path:`/tmp/sbs/${label}-${theme}-${mode}.png`});
}
fs.writeFileSync(`/tmp/sbs/${label}.json`, JSON.stringify(out,null,1)); await b.close(); console.log(label,'done');
