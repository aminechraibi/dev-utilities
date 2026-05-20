export type BubbleShape = 'circle' | 'square' | 'diamond';

export interface BubbleOptions {
  shape: BubbleShape
  size: number
  bgColor: string
  textColor: string
}

export function generateBubbleSvg(num: number, options: BubbleOptions): string {
  const { shape, size, bgColor, textColor } = options;
  const half = size / 2;
  const label = String(num);
  const fontSize = Math.max(10, Math.floor(size * 0.45));

  let shapeEl = '';

  if (shape === 'circle') {
    shapeEl = `<circle cx="${half}" cy="${half}" r="${half}" fill="${bgColor}" />`;
  }
  else if (shape === 'square') {
    const r = Math.floor(size * 0.15);
    shapeEl = `<rect x="0" y="0" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${bgColor}" />`;
  }
  else if (shape === 'diamond') {
    const pts = `${half},0 ${size},${half} ${half},${size} 0,${half}`;
    shapeEl = `<polygon points="${pts}" fill="${bgColor}" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">\n  ${shapeEl}\n  <text x="${half}" y="${half}" dominant-baseline="central" text-anchor="middle" font-family="sans-serif" font-size="${fontSize}" font-weight="bold" fill="${textColor}">${label}</text>\n</svg>`;
}
