import axios from "axios";


class FinnhubFinanceApi {

  static API_BASE_URL = "https://finnhub.io/api/v1";  
  static async getStockNews(symbol) {
      // symbol: stock ticker, from/to: YYYY-MM-DD
      const to = new Date().toISOString().slice(0, 10); // today, YYYY-MM-DD
      const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // 7 days ago
      
      const apiKey = process.env.REACT_APP_FINNHUB_API_KEY;
      const url = `${this.API_BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${apiKey}`;
      try {
        const response = await axios.get(url);
        if (response.data && response.data.length > 0) {
          return response.data.slice(0, 5);
        } else {
          return [];
        }
      } catch (err) {
        console.error("API Error:", err.response);
        let message = err.response;
        throw Array.isArray(message) ? message : [message];
      }
  }

  static async getStockNewsSummary() {
    const apiKey = process.env.REACT_APP_FINNHUB_API_KEY;
    const url = `${this.API_BASE_URL}/news?category=general&token=${apiKey}`;
    try {
      const response = await axios.get(url);
      if (response.data) {
        return response.data;
      } else {
        return [];
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
