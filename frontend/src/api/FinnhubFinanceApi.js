import axios from "axios";
const BASE_URL = "https://apidojo-yahoo-finance-v1.p.rapidapi.com";


class FinnhubFinanceApi {
  static async getStockNews(symbol) {
      // symbol: stock ticker, from/to: YYYY-MM-DD
      const to = new Date().toISOString().slice(0, 10); // today, YYYY-MM-DD
      const from = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // 21 days ago
      
    const apiKey = process.env.REACT_APP_FINNHUB_API_KEY;
    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${apiKey}`;
    try {
      const response = await axios.get(url);
      if (response.data && response.data.length > 0) {
        return response.data.slice(0, 5);
      } else {
        return "No News On This Stock";
      }
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async getStockNewsSummary() {
    const apiKey = process.env.REACT_APP_FINNHUB_API_KEY;
    const url = `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`;
    try {
      const response = await axios.get(url);
      if (response.data) {
        return response.data;
      } else {
        return "No News Summary currently available";
      }
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async getMarketSummary() {
    const res = await this.request(`market/v2/get-summary`);

    return res.data.marketSummaryAndSparkResponse.result;
  }
}

export default FinnhubFinanceApi;
