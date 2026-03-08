import { getRequest, postRequest, deleteRequest } from "./apiService";

// retrieve full watchlist for authenticated user
export const fetchWatchlist = () => {
  return getRequest("/watchlist");
};

// add a stock to watchlist, supply stockId in the body
export const addToWatchlist = (stockId) => {
  return postRequest("/watchlist/add", { stockId });
};

// remove a stock from watchlist, supply stockId in the body
export const removeFromWatchlist = (stockId) => {
  return deleteRequest("/watchlist/remove", { stockId });
};
