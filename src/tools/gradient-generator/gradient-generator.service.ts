export interface ColorStop {
  color: string;
  position: number;
}

export function generateGradientCss(
  type: 'linear' | 'radial' | 'conic',
  stops: ColorStop[],
  angle: number,
  shape: 'ellipse' | 'circle' = 'ellipse',
): string {
  const stopList = stops
    .map(s => `${s.color} ${s.position}%`)
    .join(', ');

  if (type === 'linear') {
    return `linear-gradient(${angle}deg, ${stopList})`;
  }
  if (type === 'radial') {
    return `radial-gradient(${shape} at center, ${stopList})`;
  }
  // conic
  return `conic-gradient(from ${angle}deg, ${stopList})`;
}
