import { getRequest } from "./apiService";

export const stockApi = {
  getAll: (params) => {
    return getRequest("/stocks", params);
  },

  search: (query) => {
    return getRequest("/stocks/search", { q: query });
  },

  getBySymbol: (symbol) => {
    return getRequest(`/stocks/symbol/${symbol}`);
  },
};

