export interface FaviconOptions {
  text: string
  bgColor: string
  textColor: string
  size: number
}

export function renderFaviconToCanvas(canvas: HTMLCanvasElement, options: FaviconOptions): void {
  const { text, bgColor, textColor, size } = options;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  if (!text.trim()) {
    return;
  }

  // Auto-fit font size
  let fontSize = Math.floor(size * 0.65);
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  // Shrink font until it fits
  while (fontSize > 6 && ctx.measureText(text).width > size * 0.9) {
    fontSize -= 1;
    ctx.font = `bold ${fontSize}px sans-serif`;
  }

  ctx.fillStyle = textColor;
  ctx.fillText(text, size / 2, size / 2);
}

export function canvasToPngDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}
