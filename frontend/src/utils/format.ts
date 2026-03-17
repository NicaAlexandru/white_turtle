export function formatTimeSlot(days: string, startTime: string, endTime: string): string {
  return `${days} ${startTime}-${endTime}`;
}

/** Expands "MWF" -> ["M","W","F"], "TTH" -> ["T","H"] (H = Thursday) */
export function expandDays(days: string): string[] {
  return days.toUpperCase().replace('TH', 'H').split('');
}
