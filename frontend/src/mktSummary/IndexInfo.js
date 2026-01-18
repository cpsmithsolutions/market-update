import React, { useState } from "react";
import "../stockinfo/Stockinfo.css";
import { Row, Col } from "reactstrap";
import { abreviateLargeNums, addCommas } from "../helpers/abreviateLargeNums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import IndexItem from "./IndexItem";
import Chart from "../chart/Chart";
import News from "../news/News";
import ChaseLoading from "../chaseloading/ChaseLoading";
import { refreshMarketSummaryAndChartData } from "../helpers/refreshStockDataFunctions";

import "./IndexInfo.css";

const IndexInfo = ({ ticker, chartData, chartLoading, chartError }) => {
  // chartData, chartLoading, chartError are now passed as props from IndexItem
  const [collapse, setCollapse] = useState(false);
  const [collapseNews, setCollapseNews] = useState(false);
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
  let percentColor;

  marketChange.market >= 0
    ? (percentColor = "LimeGreen")
    : (percentColor = "red");

  const marketPrice = ticker.regularMarketPrice
    ? addCommas(ticker.regularMarketPrice.toFixed(2))
    : "N/A";

  const mktCap = ticker.marketCap
    ? `$${abreviateLargeNums(ticker.marketCap)}`
    : "N/A";

  const mktVol = ticker.regularMarketVolume
    ? abreviateLargeNums(ticker.regularMarketVolume)
    : "N/A";

  let percentOffHigh = (
    ((ticker.fiftyTwoWeekHigh - ticker.regularMarketPrice) /
      ticker.fiftyTwoWeekHigh) *
    100
  ).toFixed(2);

  const stringOffHigh = percentOffHigh ? (
    <span style={{ color: "red" }}>{`-${percentOffHigh} %`}</span>
  ) : (
    <span style={{ color: "LimeGreen" }}>52 Week High</span>
  );

  let percentAboveLow = (
    ((ticker.regularMarketPrice - ticker.fiftyTwoWeekLow) /
      ticker.regularMarketPrice) *
    100
  ).toFixed(2);

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
      <div className="Watchlist">
        <ChaseLoading />
      </div>
    );
  }
  if (chartError) {
    return <div className="Watchlist">Error loading chart data.</div>;
  }

  if (!collapse)
    return (
      <div className="Stockinfo">
        <h4 className="IndexInfo-name">
          <span
            className="IndexInfo-name-clickable"
            title="Collapse"
            onClick={handleCollapse}
          >
            {ticker.shortName}
            {/* <span className="Stockinfo-info-icon">
              <FontAwesomeIcon icon={faInfo} />
            </span> */}
          </span>

          <span
            title="Current stock price, click to refresh"
            onClick={() => refreshMarketSummaryAndChartData(ticker.symbol)}
            className="Stockinfo-price"
          >
            {marketPrice}
            {/* <span className="Stockinfo-info-icon">
              <FontAwesomeIcon icon={faInfo} />
            </span> */}
          </span>
        </h4>
        <div className="Indexinfo-description">
          <span className="exchange">{ticker.fullExchangeName} </span>
          {ticker.symbol}
          <span>
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
              <Col className="stat-titles col-6 col-sm-3 col-md-2">
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
              </Col>
              <Col className="stats col-6 col-sm-3 col-md-2">
                {open}
                <br />
                {high}
                <br />
                {low}
              </Col>
              <Col className="stat-titles col-6 col-sm-3 col-md-2">
                <span title="Average number of shares traded each day">
                  Avg Vol
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                  <br />
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
                </span>
              </Col>
              <Col className="stats col-6 col-sm-3 col-md-2">
                {mktVol}
                <br />
                {fiftyTwoWeekHigh}
                <br />
                {fiftyTwoWeekLow}
              </Col>
              <Col className="stat-titles col-6 col-sm-3 col-md-2">
                <span title="% difference between the 52 week high and current price">
                  52 W % / H
                  <span className="Stockinfo-info-icon">
                    <FontAwesomeIcon icon={faInfo} />
                  </span>
                </span>
                <br />
                <span title="% difference between the 52 week low and current price">
                  52 W % / L
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
              </Col>
              <Col className="stats col-6 col-sm-3 col-md-2">
                {stringOffHigh}
                <br />
                {stringAboveLow}
                <br />
                {mktCap}
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
              {/* <span className="Stockinfo-info-icon">
                <FontAwesomeIcon icon={faInfo} />
              </span> */}
            </h3>
            {collapseNews ? "" : <News ticker={ticker.symbol} />}
          </div>
        </div>
        {}
      </div>
    );
  else return <IndexItem ticker={ticker} />;
};

export default IndexInfo;
