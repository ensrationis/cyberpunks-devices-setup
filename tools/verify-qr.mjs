import fs from 'fs'; import {PNG} from 'pngjs'; import jsQR from 'jsqr';
for (const f of process.argv.slice(2)) {
  const p = PNG.sync.read(fs.readFileSync(f));
  const r = jsQR(new Uint8ClampedArray(p.data), p.width, p.height);
  console.log('===', f, p.width+'x'+p.height);
  if (!r) { console.log('  DECODE FAILED'); continue; }
  console.log('  len:', r.data.length, ' version:', r.version);
  console.log('  data:', JSON.stringify(r.data));
}
