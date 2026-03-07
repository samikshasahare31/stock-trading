import { getRequest, postRequest, deleteRequest } from "./apiService";

export const fetchWatchlist = () => {
  return getRequest("/watchlist");
};

export const getWatchlist = (stockId) => {
  return getRequest(`/watchlist/${stockId}`);
};

export const addToWatchlist = (stockId) => {
  return postRequest(`/watchlist/${stockId}`, {});
};

export const removeFromWatchlist = (stockId) => {
  return deleteRequest(`/watchlist/${stockId}`);
};
