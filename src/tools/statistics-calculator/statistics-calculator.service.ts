export interface Stats {
  count: number
  sum: number
  min: number
  max: number
  range: number
  mean: number
  median: number
  mode: number[]
  variance: number
  stdDev: number
  q1: number
  q3: number
  iqr: number
}

export function parseNumbers(input: string): number[] {
  return input
    .split(/[\s,;]+/)
    .map(s => s.trim())
    .filter(s => s !== '')
    .map(Number)
    .filter(n => !Number.isNaN(n));
}

export function calculateStatistics(numbers: number[]): Stats {
  if (numbers.length === 0) {
    throw new Error('No numbers provided');
  }
  const sorted = [...numbers].sort((a, b) => a - b);
  const n = numbers.length;
  const sum = numbers.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const median
    = n % 2 === 0 ? (sorted[n / 2 - 1]! + sorted[n / 2]!) / 2 : sorted[Math.floor(n / 2)]!;
  const freq: Record<number, number> = {};
  numbers.forEach((x) => {
    freq[x] = (freq[x] ?? 0) + 1;
  });
  const maxFreq = Math.max(...Object.values(freq));
  const mode = Object.entries(freq)
    .filter(([, v]) => v === maxFreq)
    .map(([k]) => Number(k));
  const variance = numbers.reduce((a, x) => a + (x - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);
  const q1 = sorted[Math.floor(n * 0.25)]!;
  const q3 = sorted[Math.floor(n * 0.75)]!;
  return {
    count: n,
    sum,
    min: sorted[0]!,
    max: sorted[n - 1]!,
    range: sorted[n - 1]! - sorted[0]!,
    mean,
    median,
    mode,
    variance,
    stdDev,
    q1,
    q3,
    iqr: q3 - q1,
  };
}
