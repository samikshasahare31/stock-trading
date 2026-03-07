import { postRequest, getRequest, deleteRequest } from "./apiService";

export const buyStock = (stockId, quantity) => {
  return postRequest("/transactions/buy", { stockId, quantity });
};

export const sellStock = (stockId, quantity) => {
  return postRequest("/transactions/sell", { stockId, quantity });
};

export const getTransactions = (params) => {
  return getRequest("/transactions/history", params);
};
