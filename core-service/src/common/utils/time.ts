
const WEEKDAY_TO_NUMBER: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function toHHMM(d: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
 
  return formatter.format(d);
}

export function dayOfWeekOf(d: Date, timeZone: string): number {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(d);

  return WEEKDAY_TO_NUMBER[weekday]; // 0=diel ... 6=shtune, njesoj si Schedule.day
}


export function isValidTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function zonedTimeToUtc(dateStr: string, hhmm: string, timeZone: string): Date {
  const naiveUtc = new Date(`${dateStr}T${hhmm}:00.000Z`);
  // Sa do te ishte kjo ore "muri" po ta lexonim si kohe lokale ne timeZone?
  const asIfLocal = new Date(naiveUtc.toLocaleString("en-US", { timeZone }));
  const offsetMs = naiveUtc.getTime() - asIfLocal.getTime();
  return new Date(naiveUtc.getTime() + offsetMs);
}