import { isWeekend } from 'date-fns';

export function countBusinessDays(startStr: string, endStr: string, holidays: string[] = []): number {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const [s, e] = start <= end ? [start, end] : [end, start];
  const holidaySet = new Set(holidays);
  let count = 0;
  let cur = new Date(s);
  const endTime = e.getTime();
  while (cur.getTime() <= endTime) {
    const key = cur.toISOString().split('T')[0];
    if (!isWeekend(cur) && !holidaySet.has(key)) {
      count++;
    }
    cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1);
  }
  return count;
}

export function addBusinessDays(dateStr: string, days: number, holidays: string[] = []): string {
  const holidaySet = new Set(holidays);
  const result = new Date(dateStr);
  const dir = days >= 0 ? 1 : -1;
  let remaining = Math.abs(days);
  while (remaining > 0) {
    result.setDate(result.getDate() + dir);
    const key = result.toISOString().split('T')[0];
    if (!isWeekend(result) && !holidaySet.has(key)) {
      remaining--;
    }
  }
  return result.toISOString().split('T')[0];
}
