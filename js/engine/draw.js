// Small drawing helpers shared by overworld/battle renderers.
// Falls back to flat-colored rectangles when a sprite image hasn't loaded
// (or failed to load) so the game is always playable before art lands.

const imageCache = new Map();

export function loadImage(path) {
  if (imageCache.has(path)) return imageCache.get(path);
  const img = new Image();
  const entry = { img, loaded: false, failed: false };
  img.onload = () => { entry.loaded = true; };
  img.onerror = () => { entry.failed = true; };
  img.src = path;
  imageCache.set(path, entry);
  return entry;
}

export function drawSprite(ctx, path, x, y, w, h, fallbackColor = '#888') {
  const entry = loadImage(path);
  if (entry.loaded) {
    ctx.drawImage(entry.img, x, y, w, h);
  } else {
    ctx.fillStyle = fallbackColor;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  }
}

export function drawRoundedPanel(ctx, x, y, w, h, fill = '#1c1c2b', border = '#5a5a7a') {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = border;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
}

export function drawBar(ctx, x, y, w, h, ratio, fillColor, bgColor = '#222') {
  ratio = Math.max(0, Math.min(1, ratio));
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, y, w * ratio, h);
  ctx.strokeStyle = '#000';
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}

export function drawText(ctx, text, x, y, { size = 14, color = '#e8e4d8', align = 'left', bold = false } = {}) {
  ctx.font = `${bold ? 'bold ' : ''}${size}px 'Courier New', monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  ctx.fillText(text, x, y);
}
