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

  const articles = [];
  if (stockNews === "No News On This Stock") {
    return <div className="News">No News</div>;
  }
  for (let i = 0; i < 5; i++) {
    articles.push(<Article key={stockNews[i].url} data={stockNews[i]} />);
  }

  return <div className="News">{articles}</div>;
};

export default News;
