import React from "react"
import Chart from "./Chart"
import useSWR from "swr"
import "./ChartParent.css"
import YahooFinanceApi from "../api/YahooFinanceApi"
import useRefreshInterval from "../hooks/useRefreshInterval"
import ChaseLoading from "../chaseloading/ChaseLoading"


const ChartParent = React.memo(({ tickerSymbol }) => {

  const refreshInterval = useRefreshInterval();
    const { data: chartData, isLoading: chartLoading, error: chartError } = useSWR(
      tickerSymbol ? ["index-chart-data", tickerSymbol] : null,
        () => {
          return YahooFinanceApi.getChart(tickerSymbol)
        },
      {
        dedupingInterval: 60000,
        refreshInterval
      }
    );
  
  let content;
  if (chartLoading) {
    content = <ChaseLoading />;
  } else if (chartError) {
    content = "Error loading chart data.";
  } else {
    content = <Chart chartData={chartData} />;
  }

  return (
    <div className="ChartParent-parent">
      {content}
    </div>
  );
});

export default ChartParent;