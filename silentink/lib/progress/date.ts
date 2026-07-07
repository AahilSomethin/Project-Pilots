export function getLocalISODate(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalISODate(isoDate: string): Date {
  const [y, m, d] = isoDate.split("-").map((v) => Number(v));
  return new Date(y, m - 1, d);
}

export function diffInLocalDays(fromISODate: string, toISODate: string): number {
  const from = parseLocalISODate(fromISODate);
  const to = parseLocalISODate(toISODate);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((to.getTime() - from.getTime()) / msPerDay);
}

