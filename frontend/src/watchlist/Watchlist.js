import React, {useCallback} from "react";
import useSWR from "swr";
import useRefreshInterval from "../hooks/useRefreshInterval";
import Item from "./Item";
import "./Watchlist.css";
import YahooFinanceApi from "../api/YahooFinanceApi";
import SearchBlock from "../searchBlock/SearchBlock";
import { useSelector } from "react-redux";
import ChaseLoading from "../chaseloading/ChaseLoading";

const Watchlist = () => {
  const watchlist = useSelector((store) => store.currentUser.watchlist);
  const watchlistString = watchlist ? watchlist.join(",") : "";

  const refreshInterval = useRefreshInterval();

  const fetcher = async () => {
    if (!watchlistString) return [];
    return YahooFinanceApi.searchTicker(watchlistString);
  }

  const { data: watchlistData, isLoading, error } = useSWR(
    watchlistString ? ['watchlist', watchlistString] : null,
     fetcher,
    {
      dedupingInterval: 60000,
      refreshInterval,
    }
  );

  if (isLoading) {
    return (
      <div data-testid="Watchlist" className="Watchlist">
        <ChaseLoading />
      </div>
    );
  }
  if (error) {
    return <div className="Watchlist">Error loading watchlist.</div>;
  }

  const watchlistsArray =
    watchlistData && watchlistData.length > 0
      ? watchlistData.map((ticker) => <Item key={ticker.symbol} ticker={ticker} />)
      : [];

  return (
    <div className="Watchlist">
      <div>
        <SearchBlock />
        <h3 className="Watchlist-title">Your Watchlist</h3>
      </div>
      <div className="Watchlist-stocks">
        {watchlistsArray.length > 0 ? (
          watchlistsArray
        ) : (
          <div className="Watchlist-empty">No Stocks in Watchlist</div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
