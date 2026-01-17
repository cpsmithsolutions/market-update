import React, { useState } from "react";
import useSWR from "swr";
import "./SearchBlock.css";
import SearchForm from "../common/SearchForm";
import YahooFinanceApi from "../api/YahooFinanceApi";
import Stockinfo from "../stockinfo/Stockinfo";
import ChaseLoading from "../chaseloading/ChaseLoading";

const SearchBlock = () => {
  const [searchTicker, setSearchTicker] = useState("");
  const [noResults, setNoResults] = useState("");



  console.log("SearchBlock: current searchTicker =", searchTicker);
  const { data, isLoading, error } = useSWR(
    searchTicker ? ["search-ticker", searchTicker] : null,
    async () => {
      console.log("Fetching search data for:", searchTicker);
      const response = await YahooFinanceApi.searchTicker(searchTicker);
      return response;
    },
    {
      revalidateOnFocus: false,
    }
  );

  // Fetch chart data for the found ticker (if any)
  const {
    data: chartData,
    isLoading: chartLoading,
    error: chartError
  } = useSWR(
    data && data.length > 0 && data[0].symbol ? ["chart-data", data[0].symbol] : null,
    () => {
      console.log("Fetching chart data for:", data[0].symbol);
      return YahooFinanceApi.getChart(data[0].symbol);
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000
    }
  );

  function search(ticker) {
    setNoResults("");
    setSearchTicker(ticker);
  }

  return (
    <section className="SearchBlock">
      <div className="SearchBlock-card">
        <div className="SearchBlock-search">
          <SearchForm search={search} />
        </div>
        <div className="results">
          {isLoading ? (
            <div>
              <ChaseLoading />
              <br />
              <br />
            </div>
          ) : null}
        </div>
        <div className="SearchBlock-no-results">
          {error ? "Error fetching data" : null}
          {(!isLoading && data && data.length === 0) ? "No Results Found" : null}
          {noResults ? noResults : ""}
        </div>
        {data && data.length > 0 ? (
          <Stockinfo
            singleTicker
            ticker={data[0]}
            chartData={chartData}
            chartLoading={chartLoading}
            chartError={chartError}
          />
        ) : null}
      </div>
    </section>
  );
};

export default SearchBlock;
