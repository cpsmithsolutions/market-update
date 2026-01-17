import { mutate } from 'swr';

export function refreshWatchlistAndChartData(watchlistString, tickerSymbol) {
  mutate(['watchlist', watchlistString]);
  mutate(["chart-data", tickerSymbol]);
}

export function refreshTickerAndChartData(tickerSymbol) {
  console.log("`Refreshing ticker and chart data for:", tickerSymbol);
  mutate(["search-ticker", tickerSymbol]);
  mutate(["chart-data", tickerSymbol]);
}

export function refreshMarketSummaryAndChartData(tickerSymbol) {
  console.log("Refreshing market summary and chart data for:", tickerSymbol);
  mutate("market-summary");
  mutate(["index-chart-data", tickerSymbol]);
}
