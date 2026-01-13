import axios from "axios";
const BASE_URL = "https://apidojo-yahoo-finance-v1.p.rapidapi.com";

class YahooFinanceApi {
  static async request(endpoint, method = "get") {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = {
      "x-rapidapi-key": process.env.REACT_APP_YAHOO_FINANCE_API_KEY,
      "x-rapidapi-host": `apidojo-yahoo-finance-v1.p.rapidapi.com`,
    };

    try {
      return await axios.get(url, { headers });
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async searchTicker(ticker) {
    const response = await this.request(
      `market/v2/get-quotes?region=us&symbols=${ticker}`
    );
    return response.data.quoteResponse.result;
  }
  static async getChart(ticker, range = "2y", interval = "1d") {
    const response = await this.request(
      `market/get-charts?region=us&symbol=${ticker}&interval=${interval}&range=${range}`
    );

    const symbol = response.data.chart.result[0].meta.symbol;
    if (
      !response.data.chart.result[0].indicators ||
      !response.data.chart.result[0].timestamp
    ) {
      return "No Chart Data Currently Available";
    }
    const { indicators, timestamp } = response.data.chart.result[0];
    const quotesArray = indicators.quote[0].close;

    function combineArrays(timestampArr, priceArr) {
      const combinedArray = [];
      for (let i = 0; i < timestampArr.length; i++) {
        combinedArray.push([timestampArr[i] * 1000, priceArr[i]]);
      }
      return combinedArray;
    }
    const data = combineArrays(timestamp, quotesArray);

    const result = {
      data,
      name: symbol,
      range,
    };

    return result;
  }
  static async getMarketSummary() {
    const res = await this.request(`market/v2/get-summary`);

    return res.data.marketSummaryAndSparkResponse.result;
  }
}

export default YahooFinanceApi;
