// Regenerates the Altruist QR assets. Run from the repo root:
//   npm install qrcode && node tools/generate-qr.mjs
//
// The payload is deliberately short: every character makes the code denser and
// harder to scan off packaging. The intent hint stays in ("help me set up"),
// because a bare URL used to make assistants summarise the guide instead of
// helping — see commit c81d6ec. Everything beyond that hint is the guide's job:
// section 1 of the guide already covers "a bare link means the user wants help".
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export const PAYLOAD =
  'Help me set up my Altruist: https://sensors.social/altruist-ai-guide.md';

const OPTS = { errorCorrectionLevel: 'Q', margin: 4 };
const OUT = path.join(process.cwd(), 'altruist');

const info = QRCode.create(PAYLOAD, OPTS);
console.log(`payload: ${PAYLOAD.length} chars`);
console.log(`version ${info.version} — ${info.modules.size}x${info.modules.size} modules, ECC ${OPTS.errorCorrectionLevel}`);

await QRCode.toFile(path.join(OUT, 'altruist-guide-qr.png'), PAYLOAD, { ...OPTS, type: 'png', scale: 24 });
fs.writeFileSync(path.join(OUT, 'altruist-guide-qr.svg'), await QRCode.toString(PAYLOAD, { ...OPTS, type: 'svg' }));
console.log('wrote altruist/altruist-guide-qr.{png,svg}');
