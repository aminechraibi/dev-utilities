import cronstrue from 'cronstrue';
import { isValidCron } from 'cron-validator';

export interface CronParseResult {
  description: string
  nextRuns: Date[]
}

function parseField(field: string, min: number, max: number): number[] {
  const values: number[] = [];

  if (field === '*') {
    for (let i = min; i <= max; i++) {
      values.push(i);
    }
    return values;
  }

  const parts = field.split(',');
  for (const part of parts) {
    if (part.includes('/')) {
      const [rangePart, stepStr] = part.split('/');
      const step = Number.parseInt(stepStr, 10);
      let start = min;
      let end = max;
      if (rangePart && rangePart !== '*') {
        if (rangePart.includes('-')) {
          const [s, e] = rangePart.split('-').map(Number);
          start = s;
          end = e;
        }
        else {
          start = Number.parseInt(rangePart, 10);
        }
      }
      for (let i = start; i <= end; i += step) {
        values.push(i);
      }
    }
    else if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        values.push(i);
      }
    }
    else if (part !== '*') {
      const val = Number.parseInt(part, 10);
      if (!Number.isNaN(val)) {
        values.push(val);
      }
    }
  }

  return [...new Set(values)].sort((a, b) => a - b);
}

const PRESET_MAP: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};

const DOW_MAP: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

const MONTH_MAP: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

function normalizeField(field: string): string {
  let normalized = field.toLowerCase();
  for (const [alias, num] of Object.entries(DOW_MAP)) {
    normalized = normalized.replace(new RegExp(`\\b${alias}\\b`, 'g'), String(num));
  }
  for (const [alias, num] of Object.entries(MONTH_MAP)) {
    normalized = normalized.replace(new RegExp(`\\b${alias}\\b`, 'g'), String(num));
  }
  return normalized;
}

function getNextRuns(expr: string, count: number): Date[] {
  // Resolve presets
  const resolvedExpr = PRESET_MAP[expr.toLowerCase()] ?? expr;

  const parts = resolvedExpr.trim().split(/\s+/);
  // Support 5-field (min hr dom mon dow) and 6-field (sec min hr dom mon dow)
  let minuteField: string;
  let hourField: string;
  let domField: string;
  let monthField: string;
  let dowField: string;

  if (parts.length === 5) {
    [minuteField, hourField, domField, monthField, dowField] = parts;
  }
  else if (parts.length === 6) {
    // Seconds-based — ignore seconds field for scheduling purposes
    [, minuteField, hourField, domField, monthField, dowField] = parts;
  }
  else {
    return [];
  }

  const minutes = parseField(normalizeField(minuteField), 0, 59);
  const hours = parseField(normalizeField(hourField), 0, 23);
  const doms = parseField(normalizeField(domField), 1, 31);
  const months = parseField(normalizeField(monthField), 1, 12);
  const dows = parseField(normalizeField(dowField), 0, 6);

  const domStar = domField === '*';
  const dowStar = dowField === '*';

  const results: Date[] = [];
  const now = new Date();
  // Start from the next minute
  const startDate = new Date(now);
  startDate.setSeconds(0, 0);
  startDate.setMinutes(startDate.getMinutes() + 1);

  let current = new Date(startDate);
  const maxIterations = 366 * 24 * 60 * 2; // 2 years of minutes max
  let iterations = 0;

  while (results.length < count && iterations < maxIterations) {
    iterations++;

    const month = current.getMonth() + 1; // 1-12
    const dom = current.getDate();
    const hour = current.getHours();
    const minute = current.getMinutes();
    const dow = current.getDay(); // 0=Sun

    if (!months.includes(month)) {
      // Jump to first day of next valid month
      const nextMonth = months.find(m => m > month) ?? months[0];
      const yearAdd = nextMonth <= month ? 1 : 0;
      current = new Date(current.getFullYear() + yearAdd, nextMonth - 1, 1, 0, 0, 0, 0);
      continue;
    }

    // DOM/DOW logic: if both are specified (not *), match either; otherwise match the specified one
    const domMatch = doms.includes(dom);
    const dowMatch = dows.includes(dow);

    let dateMatch: boolean;
    if (domStar && dowStar) {
      dateMatch = true;
    }
    else if (domStar) {
      dateMatch = dowMatch;
    }
    else if (dowStar) {
      dateMatch = domMatch;
    }
    else {
      dateMatch = domMatch || dowMatch;
    }

    if (!dateMatch) {
      // Move to next day
      current = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1, 0, 0, 0, 0);
      continue;
    }

    if (!hours.includes(hour)) {
      const nextHour = hours.find(h => h > hour);
      if (nextHour === undefined) {
        current = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1, 0, 0, 0, 0);
      }
      else {
        current = new Date(current.getFullYear(), current.getMonth(), current.getDate(), nextHour, 0, 0, 0);
      }
      continue;
    }

    if (!minutes.includes(minute)) {
      const nextMinute = minutes.find(m => m > minute);
      if (nextMinute === undefined) {
        const nextHourIdx = hours.indexOf(hour) + 1;
        if (nextHourIdx < hours.length) {
          current = new Date(current.getFullYear(), current.getMonth(), current.getDate(), hours[nextHourIdx], 0, 0, 0);
        }
        else {
          current = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1, 0, 0, 0, 0);
        }
      }
      else {
        current = new Date(current.getFullYear(), current.getMonth(), current.getDate(), hour, nextMinute, 0, 0);
      }
      continue;
    }

    results.push(new Date(current));
    // Advance to next minute
    current = new Date(current.getFullYear(), current.getMonth(), current.getDate(), hour, minute + 1, 0, 0);
  }

  return results;
}

export function isCronValid(expr: string): boolean {
  if (PRESET_MAP[expr.toLowerCase()]) {
    return true;
  }
  return isValidCron(expr, { allowBlankDay: true, alias: true, seconds: true });
}

export function parseCronExpression(expr: string): CronParseResult {
  const description = cronstrue.toString(expr, {
    verbose: true,
    use24HourTimeFormat: true,
    throwExceptionOnParseError: true,
  });

  const nextRuns = getNextRuns(expr, 5);

  return { description, nextRuns };
}
