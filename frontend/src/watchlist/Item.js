import React, { useState } from "react";
import useSWR from "swr";
import "../stockinfo/Stockinfo.css";
import { Button } from "reactstrap";
import { addCommas } from "../helpers/abreviateLargeNums";
import "../stockinfo/Stockinfo.css";
import "./Item.css";
import { refreshWatchlistAndChartData } from "../helpers/refreshStockDataFunctions";

import {
  removeTickerFromList,
  addTickerToList,
} from "../actions/actionCreators";
import { SEARCH_TICKER_DATA } from "../actions/types";
import { useDispatch, useSelector } from "react-redux";
import YahooFinanceApi from "../api/YahooFinanceApi";
import Stockinfo from "../stockinfo/Stockinfo";
import useRefreshInterval from "../hooks/useRefreshInterval";

const Item = ({ ticker }) => {
  const currentUser = useSelector((store) => store.currentUser);
  const watchlist = useSelector((store) => store.currentUser.watchlist);
  const watchlistString = watchlist ? watchlist.join(",") : "";
  const dispatch = useDispatch();
  let alreadyAdded = false;
  if (Object.keys(currentUser).length)
    alreadyAdded = currentUser.watchlist.filter((t) => t === ticker.symbol);
  const [expand, setExpand] = useState(true);
  const [added, setAdded] = useState(alreadyAdded.length !== 0);

  const refreshInterval = useRefreshInterval();
 const { data: chartData, isLoading: chartLoading, error: chartError } = useSWR(
      ticker.symbol ? ["chart-data", ticker.symbol] : null,
   () => {
     console.log("Fetching chart data for:", ticker.symbol);
     return YahooFinanceApi.getChart(ticker.symbol)
   },
      {
        dedupingInterval: 60000,
        refreshInterval
      }
    );



  const marketChange = {
    percent: `${ticker.regularMarketChangePercent.toFixed(2)} %`,
    market: ticker.regularMarketChange.toFixed(2),
  };
  const [percent, setPercent] = useState(true);

  function handleClick() {
    percent ? setPercent(false) : setPercent(true);
  }



  function addToWatchlist() {
    dispatch(addTickerToList(currentUser.username, ticker));
    dispatch({ type: SEARCH_TICKER_DATA, tickerData: null });
    setAdded(true);
  }

  async function remove() {
    dispatch(removeTickerFromList(currentUser.username, ticker));
  }

  function toggleExpand() {
    if (!expand) setExpand(true);
    else setExpand(false);
  }


  let percentColor;
  marketChange.market >= 0
    ? (percentColor = "LimeGreen")
    : (percentColor = "red");
  const marketPrice = ticker.regularMarketPrice
    ? addCommas(ticker.regularMarketPrice.toFixed(2))
    : "N/A";

  if (!expand) {
    return (
      <div className="Item">
        <h4 className="Item-title">
          <span
            className="Item-title-clickable"
            title="Expand"
            onClick={toggleExpand}
          >
            {ticker.symbol}
            {/* <span className="Item-info-icon">
              <FontAwesomeIcon icon={faInfo} />
            </span> */}
          </span>
          {Object.keys(currentUser).length > 0 ? (
            <span>
              {!added ? (
                <Button
                  className="Item-btn-watchlist"
                  onClick={addToWatchlist}
                  size="sm"
                >
                  Add
                </Button>
              ) : (
                <Button
                  className="Item-btn-watchlist"
                  onClick={remove}
                  size="sm"
                >
                  Remove
                </Button>
              )}
            </span>
          ) : (
            ""
          )}

          <span>
            <span
              title="Current stock price, click to refresh"
              onClick={() => refreshWatchlistAndChartData(watchlistString, ticker.symbol)}
              className="Stockinfo-price"
            >
              {marketPrice}
              {/* <span className="Item-info-icon">
                <FontAwesomeIcon icon={faInfo} />
              </span> */}
            </span>
          </span>
        </h4>
        <div className="Item-fullname">
          {ticker.longName}{" "}
          <span>
            <button
              onClick={handleClick}
              className="Stockinfo-daily-change Item-btn-change"
              style={{ backgroundColor: percentColor }}
            >
              {percent ? marketChange.percent : marketChange.market}
            </button>
          </span>
        </div>
      </div>
    );
  }
  if (expand) {

    return <Stockinfo ticker={ticker} chartData={chartData} chartLoading={chartLoading} chartError={chartError} />;
  }
};

export default Item;
