const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Minimal pure PNG generator without external dependencies
function createPng(width, height, drawFn) {
  // RGBA buffer: width * height * 4
  const rawData = Buffer.alloc(height * (1 + width * 4));

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function makeChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);

    const typeBuffer = Buffer.from(type, 'ascii');
    const crcData = Buffer.concat([typeBuffer, data]);
    const crc = crc32(crcData);

    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc, 0);

    return Buffer.concat([length, typeBuffer, data, crcBuffer]);
  }

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: 6 (RGBA)
  ihdrData[10] = 0; // Compression: deflate
  ihdrData[11] = 0; // Filter: standard
  ihdrData[12] = 0; // Interlace: none

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Table-based CRC32 for PNG chunks
function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }

  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

// Draw stylized 3D Flipbook logo
function drawLogo(x, y, w, h, isMaskable = false) {
  const nx = (x / w) * 100;
  const ny = (y / h) * 100;

  // Background: Deep Slate gradient
  let bgR = 2, bgG = 6, bgB = 23; // #020617
  if (ny > 50) {
    const factor = (ny - 50) / 50;
    bgR = Math.round(2 + factor * (15 - 2));
    bgG = Math.round(6 + factor * (23 - 6));
    bgB = Math.round(23 + factor * (42 - 23));
  }

  // If not maskable, round corners
  if (!isMaskable) {
    const rx = Math.abs(nx - 50);
    const ry = Math.abs(ny - 50);
    const radius = 22; // corner radius %
    if (rx > 50 - radius && ry > 50 - radius) {
      const dx = rx - (50 - radius);
      const dy = ry - (50 - radius);
      if (dx * dx + dy * dy > radius * radius) {
        return [0, 0, 0, 0]; // Transparent
      }
    }
  }

  // Book shape (center bounding box 20% to 80% on X, 25% to 75% on Y)
  const leftPage = nx >= 24 && nx <= 48 && ny >= 28 && ny <= 72;
  const rightPage = nx >= 52 && nx <= 76 && ny >= 28 && ny <= 72;
  const spine = nx > 48 && nx < 52 && ny >= 26 && ny <= 74;

  // Turning leaf arc (3D page turning curve in center-right)
  const isTurningPage = nx >= 46 && nx <= 68 && ny >= 26 && ny <= 70 && (
    // curve equation
    Math.sin(((nx - 46) / 22) * Math.PI) * 14 + 28 <= ny &&
    ny <= Math.sin(((nx - 46) / 22) * Math.PI) * 14 + 68
  );

  if (spine) {
    return [16, 185, 129, 255]; // Emerald-500 spine
  }

  if (isTurningPage) {
    // Gradient on turning page (Emerald to Gold/Teal highlight)
    const factor = (nx - 46) / 22;
    const r = Math.round(52 + factor * (245 - 52));
    const g = Math.round(211 + factor * (158 - 211));
    const b = Math.round(153 + factor * (11 - 153));
    return [r, g, b, 255];
  }

  if (leftPage) {
    // Left book leaf (Emerald to Teal)
    const factor = (nx - 24) / 24;
    const r = Math.round(16 + factor * (20 - 16));
    const g = Math.round(185 + factor * (148 - 185));
    const b = Math.round(129 + factor * (160 - 129));
    
    // Page border / lines
    if (ny >= 36 && ny <= 39 && nx >= 28 && nx <= 44) return [240, 253, 244, 230];
    if (ny >= 44 && ny <= 47 && nx >= 28 && nx <= 44) return [209, 250, 229, 200];
    if (ny >= 52 && ny <= 55 && nx >= 28 && nx <= 40) return [209, 250, 229, 180];
    if (ny >= 60 && ny <= 63 && nx >= 28 && nx <= 42) return [209, 250, 229, 160];

    return [r, g, b, 255];
  }

  if (rightPage) {
    // Right book leaf
    const factor = (nx - 52) / 24;
    const r = Math.round(13 + factor * (15 - 13));
    const g = Math.round(148 + factor * (118 - 148));
    const b = Math.round(136 + factor * (110 - 136));

    // Right page lines
    if (ny >= 36 && ny <= 39 && nx >= 56 && nx <= 72) return [240, 253, 244, 230];
    if (ny >= 44 && ny <= 47 && nx >= 56 && nx <= 72) return [209, 250, 229, 200];
    if (ny >= 52 && ny <= 55 && nx >= 56 && nx <= 68) return [209, 250, 229, 180];
    if (ny >= 60 && ny <= 63 && nx >= 56 && nx <= 70) return [209, 250, 229, 160];

    return [r, g, b, 255];
  }

  // Glow halo around the book
  const distFromCenter = Math.hypot(nx - 50, ny - 50);
  if (distFromCenter < 40) {
    const glow = Math.max(0, 1 - distFromCenter / 40);
    const r = Math.min(255, Math.round(bgR + glow * 20));
    const g = Math.min(255, Math.round(bgG + glow * 80));
    const b = Math.min(255, Math.round(bgB + glow * 60));
    return [r, g, b, 255];
  }

  return [bgR, bgG, bgB, 255];
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA Icons...');
const icon192 = createPng(192, 192, (x, y, w, h) => drawLogo(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192);

const icon512 = createPng(512, 512, (x, y, w, h) => drawLogo(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512);

const iconMaskable512 = createPng(512, 512, (x, y, w, h) => drawLogo(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'icon-maskable-512.png'), iconMaskable512);

console.log('Icons generated successfully in /public!');
