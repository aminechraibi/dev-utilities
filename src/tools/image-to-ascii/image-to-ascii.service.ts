// Dense to light character ramp
const ASCII_CHARS = '@#S%?*+;:,. ';

export function imageDataToAscii(imageData: ImageData, width: number, invert: boolean): string {
  const { data, width: srcW, height: srcH } = imageData;

  // Compute target height maintaining aspect ratio (chars are ~2x taller than wide)
  const targetW = Math.max(1, Math.round(width));
  const targetH = Math.max(1, Math.round((srcH / srcW) * targetW * 0.45));

  const lines: string[] = [];

  for (let row = 0; row < targetH; row++) {
    let line = '';
    for (let col = 0; col < targetW; col++) {
      // Sample source pixel
      const srcX = Math.floor((col / targetW) * srcW);
      const srcY = Math.floor((row / targetH) * srcH);
      const pixelIdx = (srcY * srcW + srcX) * 4;

      const r = data[pixelIdx];
      const g = data[pixelIdx + 1];
      const b = data[pixelIdx + 2];

      // Luminance (0-255)
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

      // Map brightness to character
      let charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
      if (invert) {
        charIndex = ASCII_CHARS.length - 1 - charIndex;
      }
      line += ASCII_CHARS[charIndex];
    }
    lines.push(line);
  }

  return lines.join('\n');
}
