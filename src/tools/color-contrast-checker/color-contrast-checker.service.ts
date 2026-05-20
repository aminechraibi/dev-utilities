import { colord } from 'colord';

function relativeLuminance(hex: string): number {
  const { r, g, b } = colord(hex).toRgb();
  return [r, g, b].reduce((sum, v, i) => {
    const s = v / 255;
    const linear = s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    return sum + linear * [0.2126, 0.7152, 0.0722][i];
  }, 0);
}

export function getContrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

export function getWcagLevel(ratio: number, isLargeText: boolean): 'AAA' | 'AA' | 'FAIL' {
  if (isLargeText) {
    return ratio >= 4.5 ? 'AAA' : ratio >= 3 ? 'AA' : 'FAIL';
  }
  return ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'FAIL';
}

export function isValidHex(hex: string): boolean {
  return /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex);
}
