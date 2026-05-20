import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInWeeks,
  differenceInYears,
} from 'date-fns';

export function calculateDateDiff(a: string, b: string) {
  const dateA = new Date(a);
  const dateB = new Date(b);
  const start = dateA < dateB ? dateA : dateB;
  const end = dateA < dateB ? dateB : dateA;

  const totalYears = differenceInYears(end, start);
  const totalMonths = differenceInMonths(end, start);
  const totalDays = differenceInDays(end, start);
  const totalHours = differenceInHours(end, start);
  const totalMinutes = differenceInMinutes(end, start);
  const totalSeconds = differenceInSeconds(end, start);

  const remMonths = totalMonths - totalYears * 12;
  const afterYearsMonths = new Date(start);
  afterYearsMonths.setFullYear(afterYearsMonths.getFullYear() + totalYears);
  afterYearsMonths.setMonth(afterYearsMonths.getMonth() + remMonths);
  const remDays = differenceInDays(end, afterYearsMonths);

  const remHours = totalHours - totalDays * 24;
  const remMinutes = totalMinutes - totalHours * 60;
  const remSeconds = totalSeconds - totalMinutes * 60;

  const parts = [];
  if (totalYears > 0) {
    parts.push(`${totalYears}y`);
  }
  if (remMonths > 0) {
    parts.push(`${remMonths}mo`);
  }
  if (remDays > 0) {
    parts.push(`${remDays}d`);
  }
  if (remHours > 0) {
    parts.push(`${remHours}h`);
  }
  if (remMinutes > 0) {
    parts.push(`${remMinutes}m`);
  }
  if (remSeconds > 0 || parts.length === 0) {
    parts.push(`${remSeconds}s`);
  }

  return {
    totalYears,
    totalMonths,
    totalWeeks: differenceInWeeks(end, start),
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    breakdown: parts.join(' '),
  };
}
