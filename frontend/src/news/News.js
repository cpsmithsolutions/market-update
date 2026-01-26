import React from 'react';
import useSWR from 'swr';
import Article from './Article';
import ChaseLoading from '../chaseloading/ChaseLoading';
import FinnhubFinanceApi from '../api/FinnhubFinanceApi';

const fetcher = (ticker) => FinnhubFinanceApi.getStockNews(ticker);

const News = React.memo(({ ticker }) => {
  const { data, error, isLoading } = useSWR(['stock-news', ticker], () => fetcher(ticker), {
    dedupingInterval: 60000,
  });

  console.log({ data });

  if (isLoading) {
    return (
      <div className="Watchlist">
        <ChaseLoading />
      </div>
    );
  }
  if (error) {
    return <div className="News">Error loading news.</div>;
  }
  if (typeof data === 'string' || !data || data.length === 0) {
    return <div className="News">No News</div>;
  }

  const articles = (Array.isArray(data) ? data : []).map((article) => (
    <Article key={article.url} data={article} />
  ));

  return <div className="News">{articles}</div>;
});

export default News;
