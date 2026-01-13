import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

class MarketUpdateApi {
  // the token for interacting with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${MarketUpdateApi.token}`,
    };

    try {
      if (method === "get") {
        return (await axios.get(url, { headers })).data;
      }
      if (method === "post") {
        return (await axios.post(url, { ...data }, { headers })).data;
      }

      if (method === "patch") {
        return (await axios.patch(url, { ...data }, { headers })).data;
      }

      if (method === "delete") {
        return (await axios.delete(url, { headers })).data;
      }
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  static async addTickerToWatchlist(username, ticker) {
    let res = await this.request(
      `users/${username}/watchlist/${ticker}`,
      {},
      "post"
    );
    return res;
  }
  static async removeFromWatchlist(username, ticker) {
    let res = await this.request(
      `users/${username}/watchlist/${ticker}`,
      {},
      "delete"
    );
    return res;
  }

  static async getToken(username, password) {
    let res = await this.request(`auth/token`, { username, password }, "post");
    MarketUpdateApi.token = res.token;

    return res.token;
  }

  static async registerUser(formData) {
    let res = await this.request(`auth/register`, { ...formData }, "post");
    MarketUpdateApi.token = res.token;
    return res.token;
  }

  static async getCurrentUserData(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }
  static async clearToken() {
    MarketUpdateApi.token = "";
  }

  static async updateProfile(formData) {
    // check if pasword matches, if not throws error
    await this.getToken(formData.username, formData.password);
    const res = await this.request(
      `users/${formData.username}`,
      {
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      },
      "patch"
    );
    return res;
  }

  static async deleteProfile(username) {
    const res = await this.request(`users/${username}`, {}, "delete");
    return res;
  }
}

export default MarketUpdateApi;
