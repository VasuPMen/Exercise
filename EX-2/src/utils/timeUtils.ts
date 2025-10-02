export function parseTimeToMinutes(time: string): number {
  if (!/^\d{1,2}:\d{2}$/.test(time)) {
    throw new Error('Invalid time format. Expected HH:mm');
  }
  const parts = time.split(':').map(s => parseInt(s, 10));
  const h = parts[0];
  const m = parts[1];
  if (Number.isNaN(h) || Number.isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
    throw new Error('Invalid time. Hours must be 0-23 and minutes 0-59.');
  }
  return h * 60 + m;
}

export function minutesToHHMM(mins: number): string {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}
