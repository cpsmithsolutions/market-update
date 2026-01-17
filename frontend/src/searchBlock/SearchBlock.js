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

  const { data, isLoading, error } = useSWR(
    searchTicker ? searchTicker : null,
    async (ticker) => {
      console.log("SEARCH TICKER FETCHER CALLED FOR:", ticker);
      const response = await YahooFinanceApi.searchTicker(ticker);
      return response;
    },
    {
      revalidateOnFocus: false,
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
        {data && data.length > 0 ? <Stockinfo singleTicker ticker={data[0]} /> : null}
      </div>
    </section>
  );
};

export default SearchBlock;
