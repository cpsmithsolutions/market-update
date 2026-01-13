import React, { useEffect, useState } from "react";
import Article from "./Article";
import ChaseLoading from "../chaseloading/ChaseLoading";
import FinnhubFinanceApi from "../api/FinnhubFinanceApi";

const News = ({ ticker }) => {
  const [stockNews, setStockNews] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getNews(ticker) {
      const res = await FinnhubFinanceApi.getStockNews(ticker);
      if (res) {
            setStockNews(res);
      }
      setLoading(false);
    }

    getNews(ticker);
  }, [ticker]);

  if (loading) {
    return (
      <div className="Watchlist">
        <ChaseLoading />
      </div>
    );
  }


  if (stockNews.length === 0) {
    return <div className="News">No News</div>;
  }

  const articles = stockNews.map((article) => (
    <Article key={article.url} data={article} />
  ));

  return <div className="News">{articles}</div>;
};

export default News;
