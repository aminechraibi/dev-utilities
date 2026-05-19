// CODE128B patterns - each character 0-106
const PATTERNS = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112',
];

const START_B = 104;
const STOP = 106;

export interface BarcodeOptions {
  barWidth?: number
  height?: number
  showText?: boolean
}

export function generateCode128Svg(text: string, options: BarcodeOptions = {}): string {
  const { barWidth = 2, height = 80, showText = true } = options;
  if (!text) {
    return '';
  }

  // Build symbol indices
  const indices: number[] = [START_B];
  let checksum = START_B;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i) - 32;
    if (code < 0 || code > 94) {
      throw new Error(`Character '${text[i]}' not supported in CODE128B`);
    }
    indices.push(code);
    checksum += code * (i + 1);
  }
  indices.push(checksum % 103);
  indices.push(STOP);

  // Build bar pattern
  let x = 10;
  const bars: { x: number; w: number; h: number }[] = [];

  for (const idx of indices) {
    const pattern = PATTERNS[idx];
    for (let i = 0; i < pattern.length; i++) {
      const w = Number.parseInt(pattern[i]) * barWidth;
      if (i % 2 === 0) {
        bars.push({ x, w, h: height });
      }
      x += w;
    }
  }
  x += 10;

  const textY = height + 16;
  const totalHeight = showText ? height + 24 : height + 4;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${x}" height="${totalHeight}" viewBox="0 0 ${x} ${totalHeight}">`,
    `<rect width="${x}" height="${totalHeight}" fill="white"/>`,
    ...bars.map(b => `<rect x="${b.x}" y="2" width="${b.w}" height="${b.h}" fill="black"/>`),
    showText ? `<text x="${x / 2}" y="${textY}" text-anchor="middle" font-family="monospace" font-size="12">${text}</text>` : '',
    '</svg>',
  ].join('\n');
}
