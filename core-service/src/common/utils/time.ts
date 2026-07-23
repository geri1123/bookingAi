export function toHHMM(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
 
export function dayOfWeekOf(d: Date): number {
  return d.getDay(); // 0=diel ... 6=shtune, njesoj si Schedule.day
}
 