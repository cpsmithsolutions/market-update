import React from "react";
import useSWR from "swr";
import YahooFinanceApi from "../api/YahooFinanceApi";
import useRefreshInterval from "../hooks/useRefreshInterval";
import "./MktSummary.css";
import IndexItem from "./IndexItem";
import NewsSummary from "../news/NewsSummary";
import ChaseLoading from "../chaseloading/ChaseLoading";

const fetcher = () => {
  console.log("Fetching market summary data");
 return YahooFinanceApi.searchTicker(
    "^gspc,^dji,^ixic,^rut,^tnx,usdeur=x,gc=f,cl=f,btc-usd"
  );
}


const MktSummary = () => {
  const refreshInterval = useRefreshInterval();
  const { data: summaryData, error, isLoading } = useSWR(
    "market-summary",
    fetcher,
    {
      dedupingInterval: 60000,
      refreshInterval,
    }
  );

  if (isLoading)
    return (
      <div data-testid="MktSummary-load" className="MktSummary-loading">
        <ChaseLoading />
      </div>
    );
  if (error)
    return <div className="MktSummary-error" >Error loading market summary</div>;

  const items = (summaryData || []).map((index) => (
    <IndexItem key={index.shortName} ticker={index} />
  ));

  return (
    <div className="MktSummary">
      <div className="MktSummary-indices">
        <h3 className="MktSummary-index-title">Market Summary</h3>
        {items}
      </div>
      {<NewsSummary numberOfArticles="10" />}
    </div>
  );
};

export default MktSummary;
