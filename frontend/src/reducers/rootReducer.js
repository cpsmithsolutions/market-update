import {
  REMOVE_TICKER,
  ADD_TICKER,
  UPDATE_CURR_USER,
  LOG_OUT,
  SIGN_UP,
  UPDATE_PROFILE,
  SEARCH_TICKER_DATA,
} from "../actions/types";

const DEFAULT_STATE = {
  currentUser: {},
  watchlist: [],
  searchTickerData: null,
};

function rootReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case REMOVE_TICKER:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          watchlist: state.currentUser.watchlist.filter(
            (t) => t !== action.ticker.symbol
          ),
        }
      };
    case SEARCH_TICKER_DATA:
      return {
        ...state,
        searchTickerData: action.tickerData,
      };

    case ADD_TICKER:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          watchlist: [...state.currentUser.watchlist, action.ticker.symbol],
        }
      };

    case UPDATE_CURR_USER:
      return {
        ...state,
        currentUser: { ...action.currentUser },
      };

    case UPDATE_PROFILE:
      return {
        ...state,
        currentUser: { ...action.currentUser },
      };

    case LOG_OUT:
      return {
        ...state,
        currentUser: {},
        watchlist: [],
      };

    case SIGN_UP:
      return {
        ...state,
        currentUser: { ...action.currentUser },
      };
    default:
      return state;
  }
}
export default rootReducer;
