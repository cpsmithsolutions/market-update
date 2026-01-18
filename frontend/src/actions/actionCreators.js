import {
  ERROR,
  ADD_TICKER,
  REMOVE_TICKER,
  UPDATE_CURR_USER,
} from "./types";
import MarketUpdateApi from "../api/MarketUpdateApi";
import { jwtDecode } from "jwt-decode";

export function addTickerToList(username, ticker) {
  return async function (dispatch) {
    try {
      await MarketUpdateApi.addTickerToWatchlist(username, ticker.symbol);
      return dispatch(addTicker(ticker));
    } catch (e) {
      dispatch(gotError());
    }
  };
}

export function removeTickerFromList(username, ticker) {
  return async function (dispatch) {
    try {
      await MarketUpdateApi.removeFromWatchlist(username, ticker.symbol);
      return dispatch(removeTicker(ticker));
    } catch (e) {
      dispatch(gotError());
    }
  };
}
export function updateCurrUser(currentToken) {
  return async function (dispatch) {
    try {
      if (currentToken) {
        const { username } = jwtDecode(currentToken);
        const res = await MarketUpdateApi.getCurrentUserData(username);
        return updatedCurrentUser(res);
      }
    } catch (e) {
      dispatch(gotError());
    }
  };
}

function addTicker(ticker) {
  return { type: ADD_TICKER, ticker };
}
function removeTicker(ticker) {
  return { type: REMOVE_TICKER, ticker };
}

function updatedCurrentUser(currentUser) {
  return { type: UPDATE_CURR_USER, currentUser };
}

function gotError() {
  return { type: ERROR };
}
