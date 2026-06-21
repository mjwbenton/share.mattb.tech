import { parseISO } from "date-fns/parseISO";

export function formatDuration(value: number): string {
  const hours = Math.floor(value / 3600);
  if (hours > 0) {
    const minutes = Math.floor((value % 3600) / 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  const minutes = Math.floor(value / 60);
  const seconds = Math.round(value % 60);
  return `${minutes}m ${seconds}s`;
}

export function formatKm(value: number): string {
  return `${value.toFixed(2)}km`;
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "short",
  timeStyle: "short",
});

export function formatStartTime(value: string): string {
  return DATE_FORMAT.format(parseISO(value));
}
