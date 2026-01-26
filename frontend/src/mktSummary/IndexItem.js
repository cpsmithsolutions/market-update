import React, { useState } from "react";
import useSWR from "swr";
import { addCommas } from "../helpers/abreviateLargeNums";
import IndexInfo from "./IndexInfo";
import "../stockinfo/Stockinfo.css";
import "../watchlist/Item.css";
import "./IndexItem.css";
import YahooFinanceApi from "../api/YahooFinanceApi";
import useRefreshInterval from "../hooks/useRefreshInterval";
import { refreshMarketSummaryAndChartData } from "../helpers/refreshStockDataFunctions";

const IndexItem = ({ ticker }) => {
  const [expand, setExpand] = useState(false);
  const marketChange = {
    percent: `${ticker.regularMarketChangePercent.toFixed(2)} %`,
    market: ticker.regularMarketChange.toFixed(2),
  };
  const [percent, setPercent] = useState(true);

  function handleClick() {
    percent ? setPercent(false) : setPercent(true);
  }

  function handleExpand() {
    if (expand) setExpand(false);
    else setExpand(true);
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
        <h4 className="Item-title IndexItem-title">
          <span
            className="Item-title-clickable"
            title="Expand"
            onClick={handleExpand}
          >
            {ticker.shortName}
          </span>
          <span>
            <span
              title="Current stock price, click to refresh"
              onClick={() => refreshMarketSummaryAndChartData(ticker.symbol)}
              className="Stockinfo-price"
            >
              {marketPrice}
            </span>
          </span>
        </h4>
        <button
          onClick={handleClick}
          className="Stockinfo-daily-change Item-btn-change"
          style={{ backgroundColor: percentColor }}
        >
          {percent ? marketChange.percent : marketChange.market}
        </button>
      </div>
    );
  }
  if (expand) {
  
      return <IndexInfo ticker={ticker}/>;
  }
};

export default IndexItem;
