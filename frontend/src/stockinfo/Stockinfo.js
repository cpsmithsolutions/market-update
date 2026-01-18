import React, { useState } from "react";
import "./Stockinfo.css";
import { Button, Row, Col } from "reactstrap";
import { abreviateLargeNums, addCommas } from "../helpers/abreviateLargeNums";
import Item from "../watchlist/Item";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import {
  addTickerToList,
  removeTickerFromList,
} from "../actions/actionCreators";
import { useDispatch, useSelector } from "react-redux";
import Chart from "../chart/Chart";
import News from "../news/News";
import ChaseLoading from "../chaseloading/ChaseLoading";
import { SEARCH_TICKER_DATA } from "../actions/types";
import { refreshWatchlistAndChartData, refreshTickerAndChartData } from "../helpers/refreshStockDataFunctions.js";

const Stockinfo = ({ ticker, chartData, chartLoading, chartError, singleTicker = false }) => {
  const dispatch = useDispatch();
  const watchlist = useSelector((store) => store.currentUser.watchlist);;
  const watchlistString = watchlist ? watchlist.join(",") : "";
  // Chart data loading handled by SWR
  const currentUser = useSelector((store) => store.currentUser);
  const [collapse, setCollapse] = useState(false);
  const [collapseNews, setCollapseNews] = useState(false);

  let alreadyAdded = [];
  if (Object.keys(currentUser).length > 0) {
    alreadyAdded = currentUser.watchlist.filter((t) => t === ticker.symbol);
  }

  const open = ticker.regularMarketOpen
    ? addCommas(ticker.regularMarketOpen.toFixed(2))
    : "N/A";
  const high = ticker.regularMarketDayHigh
    ? addCommas(ticker.regularMarketDayHigh.toFixed(2))
    : "N/A";
  const low = ticker.regularMarketDayLow
    ? addCommas(ticker.regularMarketDayLow.toFixed(2))
    : "N/A";
  const fiftyTwoWeekHigh = ticker.fiftyTwoWeekHigh
    ? addCommas(ticker.fiftyTwoWeekHigh.toFixed(2))
    : "N/A";
  const fiftyTwoWeekLow = ticker.fiftyTwoWeekLow
    ? addCommas(ticker.fiftyTwoWeekLow.toFixed(2))
    : "N/A";

  const [added, setAdded] = useState(alreadyAdded.length !== 0);
  const marketChangePercent = ticker.regularMarketChangePercent
    ? ticker.regularMarketChangePercent.toFixed(2)
    : "N/A";
  const marketChangeAmt = ticker.regularMarketChange
    ? ticker.regularMarketChange.toFixed(2)
    : "N/A";
  const marketChange = {
    percent: `${marketChangePercent} %`,
    market: marketChangeAmt,
  };
  const [percent, setPercent] = useState(true);


  function handleClick() {
    percent ? setPercent(false) : setPercent(true);
  }

  async function handleRefresh() {
    if (singleTicker) { 
   refreshTickerAndChartData(ticker.symbol);
    } else {
   refreshWatchlistAndChartData(watchlistString, ticker.symbol);
    }

  }

  function addToWatchlist() {
    dispatch(addTickerToList(currentUser.username, ticker));
    dispatch({ type: SEARCH_TICKER_DATA, tickerData: null });
    setAdded(true);
  }

  async function removeFromWatchlist() {
    await dispatch(removeTickerFromList(currentUser.username, ticker));
    dispatch({ type: SEARCH_TICKER_DATA, tickerData: null });
  }

  let percentColor;
  marketChange.market >= 0
    ? (percentColor = "LimeGreen")
    : (percentColor = "red");

  const marketPrice = ticker.regularMarketPrice
    ? addCommas(ticker.regularMarketPrice.toFixed(2))
    : "N/A";
  const trailingPE = ticker.trailingPE ? ticker.trailingPE.toFixed(2) : "N/A";
  const forwardPE = ticker.forwardPE ? ticker.forwardPE.toFixed(2) : "N/A";
  const eps = ticker.epsCurrentYear
    ? `$${ticker.epsCurrentYear.toFixed(2)}`
    : "N/A";
  const mktCap = ticker.marketCap
    ? `$${abreviateLargeNums(ticker.marketCap)}`
    : "N/A";
  const mktVol = ticker.regularMarketVolume
    ? abreviateLargeNums(ticker.regularMarketVolume)
    : "N/A";
  const dividendYield = ticker.dividendYield
    ? `${ticker.dividendYield} %`
    : "0 %";
  const peg = ticker.pegRatio ? ticker.pegRatio.toFixed(2) : "N/A";
  const pS = ticker.priceToSales ? ticker.priceToSales.toFixed(2) : "N/A";
  const beta = ticker.beta ? ticker.beta.toFixed(2) : "N/A";
  const heldPercentInsiders = ticker.heldPercentInsiders
    ? `${ticker.heldPercentInsiders.toFixed(2)} %`
    : "N/A";
  let percentOffHigh =
    ticker.regularMarketPrice && ticker.fiftyTwoWeekHigh
      ? (
          ((ticker.fiftyTwoWeekHigh - ticker.regularMarketPrice) /
            ticker.fiftyTwoWeekHigh) *
          100
        ).toFixed(2)
      : "N/A";

  const stringOffHigh = percentOffHigh ? (
    <span style={{ color: "red" }}>{`-${percentOffHigh} %`}</span>
  ) : (
    <span style={{ color: "LimeGreen" }}>52 Week High</span>
  );

  let percentAboveLow =
    ticker.regularMarketPrice && ticker.fiftyTwoWeekLow
      ? (
          ((ticker.regularMarketPrice - ticker.fiftyTwoWeekLow) /
            ticker.regularMarketPrice) *
          100
        ).toFixed(2)
      : "N/A";

  const stringAboveLow = percentAboveLow ? (
    <span style={{ color: "limeGreen" }}>{`${percentAboveLow} %`}</span>
  ) : (
    <span style={{ color: "red" }}>52 Week Low</span>
  );

  function handleCollapse() {
    setCollapse(true);
  }

  function handleCollapseNews() {
    if (collapseNews) {
      setCollapseNews(false);
    } else {
      setCollapseNews(true);
    }
  }

  if (chartLoading) {
    return (
      <div data-testid="watchlist" className="Watchlist">
        <ChaseLoading />
      </div>
    );
  }
  if (chartError) {
    return <div className="Watchlist">Error loading chart data.</div>;
  }

  if (!collapse)
    return (
      <div data-testid="resolved" className="Stockinfo">
        <h4>
          <span
            className="Stockinfo-name"
            title="Collapse"
            onClick={handleCollapse}
          >
            {ticker.longName}
          </span>
          <span
            title="Current stock price, click to refresh"
            onClick={handleRefresh}
            className="Stockinfo-price"
          >
            {marketPrice}
          </span>
        </h4>
        <div>
          <span className="exchange">{ticker.fullExchangeName} </span>
          {ticker.symbol}
          {Object.keys(currentUser).length ? (
            <span>
              {!added ? (
                <Button
                  className="Stockinfo-watchlist-btn"
                  onClick={addToWatchlist}
                  size="sm"
                >
                  Add
                </Button>
              ) : (
                <Button
                  className="Stockinfo-watchlist-btn"
                  onClick={removeFromWatchlist}
                  size="sm"
                >
                  Remove
                </Button>
              )}
            </span>
          ) : (
            ""
          )}
          <span className="Stockinfo-daily-change-position">
            {" "}
            <button
              onClick={handleClick}
              className="Stockinfo-daily-change"
              style={{ backgroundColor: percentColor }}
            >
              {percent ? marketChange.percent : marketChange.market}
            </button>
          </span>
        </div>
        <div className="Stockinfo-chart">
          {chartData ? <Chart chartData={chartData} /> : null}
        </div>
        <div>
          <div className="Stockinfo-data">
            <Row>
              <Col className="stat-titles col-6 col-sm-2">
                <span title="The price at which a security first trades upon the opening of an exchange on a trading day">
                  Open
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
                <br />
                <span title="Daily high">
                  High
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
                <br />
                <span title="Daily low">
                  Low
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
                <br />
                <span title="Average number of shares traded each day">
                  Avg Vol
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
                <br />
                <span title="A measure of a stock's volatility in relation to the overall market, with 1 being the overall markets volatility">
                  Beta
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
                <br />
                <span title="Dividend yield, expressed as a percentage, is a ratio (dividend/price) that shows how much a company pays out in dividends each year relative to its stock price.">
                  Yield
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
              </Col>
              <Col className="stats col-6 col-sm-2">
                {open}
                <br />
                {high}
                <br />
                {low}
                <br />
                {mktVol}
                <br />
                {beta}
                <br />
                {dividendYield}
              </Col>

              <Col className="stat-titles col-6 col-sm-2">
                <span title="52 week high">
                  52 W H
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
                <br />
                <span title="52 week low">
                  52 W L
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
                <br />
                <span title="% difference between the 52 week high and current price">
                  52 W% /H
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
                <br />
                <span title="% difference between the 52 week low and current price">
                  52 W% /L
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
                <br />
                <span title="Total dollar value of a company's outstanding shares of stock">
                  Mkt Cap
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
                <br />
                <span title="Price to earnings divided by expected growth rate">
                  PEG
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
              </Col>
              <Col className="stats col-6 col-sm-2">
                {fiftyTwoWeekHigh}
                <br />
                {fiftyTwoWeekLow}
                <br />
                {stringOffHigh}

                <br />
                {stringAboveLow}

                <br />
                {mktCap}
                <br />
                {peg}
              </Col>
              <Col className="stat-titles col-6 col-sm-2">
                <span title="Current stock price / the previous 12 months earnings per share">
                  Trailing P/E
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
                <br />
                <span title="Current stock price / predicted next 12 months earnings per share">
                  Forward P/E
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
                <br />
                <span title="Current stock price / the previous 12 months revenue per share">
                  P/S
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
                <br />
                <span title="Earnings per share, a company's net profit divided by the number of common shares it has outstanding">
                  EPS
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
                <br />
                <span title="Percent of shares held by shareholders who own more than 5% of the corporation or an officer or director of the company">
                  Insider Ownership
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
              </Col>
              <Col className="stats col-6 col-sm-2">
                {trailingPE}
                <br />
                {forwardPE}
                <br />
                {pS}
                <br />
                {eps}
                <br />
                {heldPercentInsiders}
              </Col>
            </Row>
          </div>
          <div className="News">
            <h3
              className="Stockinfo-news-title"
              title={collapseNews ? "Expand" : "Collapse"}
              onClick={handleCollapseNews}
            >
              News
            </h3>
            {collapseNews ? "" : <News ticker={ticker.symbol} />}
          </div>
        </div>
        {}
      </div>
    );
  else return <Item ticker={ticker} />;
};

export default Stockinfo;
