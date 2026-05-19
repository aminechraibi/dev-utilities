import { colord } from 'colord';

export interface Palettes {
  monochromatic: string[];
  complementary: string[];
  triadic: string[];
  analogous: string[];
  splitComplementary: string[];
  tetradic: string[];
}

export function generatePalettes(hex: string): Palettes {
  const { h, s, l } = colord(hex).toHsl();

  function hslToHex(hue: number, sat: number, lig: number): string {
    return colord({
      h: ((hue % 360) + 360) % 360,
      s: Math.max(0, Math.min(100, sat)),
      l: Math.max(0, Math.min(100, lig)),
    }).toHex();
  }

  // 9-step lightness scale (3×3 grid)
  const monochromatic = [15, 25, 35, 45, 55, 65, 73, 82, 91].map(lig => hslToHex(h, s, lig));

  // dark/mid/light of base + dark/mid/light of complement (2×3)
  const compH = (h + 180) % 360;
  const complementary = [
    hslToHex(h, s, Math.max(15, l - 22)),
    hex,
    hslToHex(h, s, Math.min(88, l + 22)),
    hslToHex(compH, s, Math.max(15, l - 22)),
    hslToHex(compH, s, l),
    hslToHex(compH, s, Math.min(88, l + 22)),
  ];

  // 3 hues × 2 rows: base row + tint row (2×3)
  const triadic = [
    hex,
    hslToHex(h + 120, s, l),
    hslToHex(h + 240, s, l),
    hslToHex(h, s, Math.min(88, l + 22)),
    hslToHex(h + 120, s, Math.min(88, l + 22)),
    hslToHex(h + 240, s, Math.min(88, l + 22)),
  ];

  // 6 neighboring hues (2×3)
  const analogous = [-60, -30, 0, 30, 60, 90].map(off => hslToHex(h + off, s, l));

  // 3 hues × 2 rows (2×3)
  const sc1 = (h + 150) % 360;
  const sc2 = (h + 210) % 360;
  const splitComplementary = [
    hex,
    hslToHex(sc1, s, l),
    hslToHex(sc2, s, l),
    hslToHex(h, s, Math.min(88, l + 22)),
    hslToHex(sc1, s, Math.min(88, l + 22)),
    hslToHex(sc2, s, Math.min(88, l + 22)),
  ];

  // 4 hues at 90° — shown in 4-col single row
  const tetradic = [
    hex,
    hslToHex(h + 90, s, l),
    hslToHex(h + 180, s, l),
    hslToHex(h + 270, s, l),
  ];

  return { monochromatic, complementary, triadic, analogous, splitComplementary, tetradic };
}

export function hexToHsl(hex: string): string {
  const { h, s, l } = colord(hex).toHsl();
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

export function hexToRgb(hex: string): string {
  const { r, g, b } = colord(hex).toRgb();
  return `rgb(${r}, ${g}, ${b})`;
}

export function hexToHsb(hex: string): string {
  const { h, s, v } = colord(hex).toHsv();
  return `hsb(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(v)}%)`;
}

export function hexToCmyk(hex: string): string {
  const { r, g, b } = colord(hex).toRgb();
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const k = 1 - Math.max(R, G, B);
  if (k >= 1) return 'cmyk(0, 0, 0, 100)';
  const c = Math.round(((1 - R - k) / (1 - k)) * 100);
  const m = Math.round(((1 - G - k) / (1 - k)) * 100);
  const y = Math.round(((1 - B - k) / (1 - k)) * 100);
  return `cmyk(${c}, ${m}, ${y}, ${Math.round(k * 100)})`;
}
