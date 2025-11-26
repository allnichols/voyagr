

export function getTotalDays(departureDate: Date, returnDate: Date): number {
  const start = new Date(departureDate);
  const end = new Date(returnDate);
  // Calculate difference in milliseconds, then convert to days
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}