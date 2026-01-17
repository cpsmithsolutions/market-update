import { mutate } from 'swr';

export function refreshWatchlistAndChartData(watchlistString, tickerSymbol) {
  mutate(['watchlist', watchlistString]);
  mutate(["chart-data", tickerSymbol]);
}

export function refreshTickerAndChartData(tickerSymbol) {
  mutate(["search-ticker", tickerSymbol]);
  mutate(["chart-data", tickerSymbol]);
}

export function refreshMarketSummaryAndChartData(tickerSymbol) {
  mutate("market-summary");
  mutate(["index-chart-data", tickerSymbol]);
}
