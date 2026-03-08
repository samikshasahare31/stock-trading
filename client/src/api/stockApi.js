import { getRequest } from "./apiService";

export const getAllStocks = (params = {}) => {
  return getRequest("/stocks", params);
};

export const getStockBySymbol = (symbol) => {
  return getRequest(`/stocks/symbol/${symbol}`);
};

export const getStockById = (id) => {
  return getRequest(`/stocks/${id}`);
};

export const searchStocks = (query) => {
  return getRequest("/stocks/search", { q: query });
};