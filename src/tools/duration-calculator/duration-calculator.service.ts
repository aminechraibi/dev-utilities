export interface Duration {
  hours: number;
  minutes: number;
  seconds: number;
}

export function addDurations(a: Duration, b: Duration): Duration {
  const totalSeconds = toTotalSeconds(a) + toTotalSeconds(b);
  return fromTotalSeconds(totalSeconds);
}

export function subtractDurations(a: Duration, b: Duration): Duration {
  const totalSeconds = toTotalSeconds(a) - toTotalSeconds(b);
  return fromTotalSeconds(totalSeconds);
}

export function formatDuration(d: Duration): string {
  const sign = d.hours < 0 || d.minutes < 0 || d.seconds < 0 ? '-' : '';
  const h = Math.abs(d.hours);
  const m = Math.abs(d.minutes);
  const s = Math.abs(d.seconds);
  return `${sign}${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function toTotalSeconds(d: Duration): number {
  return d.hours * 3600 + d.minutes * 60 + d.seconds;
}

export function fromTotalSeconds(totalSeconds: number): Duration {
  const negative = totalSeconds < 0;
  const abs = Math.abs(totalSeconds);
  const hours = Math.floor(abs / 3600) * (negative ? -1 : 1);
  const minutes = Math.floor((abs % 3600) / 60) * (negative ? -1 : 1);
  const seconds = (abs % 60) * (negative ? -1 : 1);
  return { hours, minutes, seconds };
}
