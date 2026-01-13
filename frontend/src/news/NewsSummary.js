import React, { useEffect, useState } from "react";
import GeneralNewsArticle from "../mktSummary/GeneralNewsArticle";
import "./NewsSummary.css";
import ChaseLoading from "../chaseloading/ChaseLoading";
import FinnhubFinanceApi from "../api/FinnhubFinanceApi";

const NewsSummary = ({ numberOfArticles }) => {
  const [loading, setLoading] = useState(true);
  const [newsData, setNewsData] = useState(null);

  useEffect(() => {
    async function getSummary() {
      const res2 = await FinnhubFinanceApi.getStockNewsSummary();
      if (res2) {
        const newsArray = res2
          .slice(0, numberOfArticles)
          .filter(article => article && article.url)
          .map(article => (
            <GeneralNewsArticle key={article.url} data={article} />
          ));
        setNewsData(newsArray);
        setLoading(false);
      }
    }
    getSummary();
  }, [numberOfArticles]);

  if (loading)
    return (
      <div className="NewsSummary-loading">
        <ChaseLoading />
      </div>
    );

  return (
    <div className="NewsSummary">
      <h3 className="NewsSummary-title">Market News</h3>
      {newsData}
      <br />
    </div>
  );
};

export default NewsSummary;
