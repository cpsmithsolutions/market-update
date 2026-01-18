import { useMemo } from "react";
import { isUSMarketOpen } from "../helpers/isUSMarketOpen";
import { REFRESH_INTERVAL_OPEN, REFRESH_INTERVAL_CLOSED } from "../constants";

/**
 * Custom hook to get the correct refresh interval based on market status.
 * Returns REFRESH_INTERVAL_OPEN if market is open, else REFRESH_INTERVAL_CLOSED.
 */
export default function useRefreshInterval() {
  return useMemo(() => (
    isUSMarketOpen() ? REFRESH_INTERVAL_OPEN : REFRESH_INTERVAL_CLOSED
  ), []);
}


