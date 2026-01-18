// Returns true if US stock market is open (Mon–Fri, 9:30am–4:00pm ET)
export function isUSMarketOpen(date = new Date()) {
  // Convert to US Eastern Time
  const utcOffset = -5; // EST is UTC-5 (not accounting for DST)
  const estNow = new Date(date.getTime() + (utcOffset - date.getTimezoneOffset() / 60) * 60 * 60 * 1000);
  const day = estNow.getUTCDay(); // 0 = Sunday, 6 = Saturday
  const hours = estNow.getUTCHours();
  const minutes = estNow.getUTCMinutes();
  // Market open: Mon–Fri, 9:30–16:00
  const isWeekday = day >= 1 && day <= 5;
  const isOpen =
    (hours > 14 || (hours === 14 && minutes >= 30)) && // 9:30am ET is 14:30 UTC
    (hours < 21 || (hours === 21 && minutes === 0));    // 4:00pm ET is 21:00 UTC
  return isWeekday && isOpen;
}
