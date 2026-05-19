export interface TimezoneEntry { zone: string; label: string }

export const defaultTimezones: TimezoneEntry[] = [
  { zone: 'UTC', label: 'UTC' },
  { zone: 'America/New_York', label: 'New York' },
  { zone: 'America/Los_Angeles', label: 'Los Angeles' },
  { zone: 'America/Chicago', label: 'Chicago' },
  { zone: 'Europe/London', label: 'London' },
  { zone: 'Europe/Paris', label: 'Paris' },
  { zone: 'Europe/Berlin', label: 'Berlin' },
  { zone: 'Asia/Tokyo', label: 'Tokyo' },
  { zone: 'Asia/Shanghai', label: 'Shanghai' },
  { zone: 'Asia/Dubai', label: 'Dubai' },
  { zone: 'Australia/Sydney', label: 'Sydney' },
];

export const allTimezones = [
  'UTC', 'Africa/Cairo', 'Africa/Johannesburg', 'America/Anchorage', 'America/Chicago',
  'America/Denver', 'America/Los_Angeles', 'America/New_York', 'America/Sao_Paulo',
  'America/Toronto', 'Asia/Bangkok', 'Asia/Colombo', 'Asia/Dhaka', 'Asia/Dubai',
  'Asia/Hong_Kong', 'Asia/Jakarta', 'Asia/Karachi', 'Asia/Kolkata', 'Asia/Kuala_Lumpur',
  'Asia/Manila', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Taipei',
  'Asia/Tehran', 'Asia/Tokyo', 'Atlantic/Reykjavik', 'Australia/Melbourne',
  'Australia/Perth', 'Australia/Sydney', 'Europe/Amsterdam', 'Europe/Athens',
  'Europe/Berlin', 'Europe/Brussels', 'Europe/Budapest', 'Europe/Dublin',
  'Europe/Helsinki', 'Europe/Istanbul', 'Europe/Kiev', 'Europe/Lisbon',
  'Europe/London', 'Europe/Madrid', 'Europe/Moscow', 'Europe/Oslo', 'Europe/Paris',
  'Europe/Prague', 'Europe/Rome', 'Europe/Stockholm', 'Europe/Vienna', 'Europe/Warsaw',
  'Europe/Zurich', 'Pacific/Auckland', 'Pacific/Honolulu',
];

export function getTimeInZone(zone: string, now: Date) {
  const time = new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
  const date = new Intl.DateTimeFormat('en-US', { timeZone: zone, weekday: 'short', month: 'short', day: 'numeric' }).format(now);
  const offset = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'shortOffset' }).formatToParts(now).find(p => p.type === 'timeZoneName')?.value ?? zone;
  return { time, date, offset };
}
