import React from "react";
import useSWR from "swr";
import GeneralNewsArticle from "../mktSummary/GeneralNewsArticle";
import "./NewsSummary.css";
import ChaseLoading from "../chaseloading/ChaseLoading";
import FinnhubFinanceApi from "../api/FinnhubFinanceApi";

const fetcher = () => FinnhubFinanceApi.getStockNewsSummary();

const NewsSummary = ({ numberOfArticles }) => {
  const { data, error, isLoading } = useSWR("news-summary", fetcher, {
    dedupingInterval: 60000,
  });

  if (isLoading)
    return (
      <div className="NewsSummary-loading">
        <ChaseLoading />
      </div>
    );
  if (error)
    return <div className="NewsSummary-error">Error loading news summary</div>;

  const newsArray = (data || [])
    .slice(0, numberOfArticles)
    .filter(article => article && article.url)
    .map(article => (
      <GeneralNewsArticle key={article.url} data={article} />
    ));

  return (
    <div className="NewsSummary">
      <h3 className="NewsSummary-title">Market News</h3>
      {newsArray}
      <br />
    </div>
  );
};

export default NewsSummary;
