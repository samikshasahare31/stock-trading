import { getRequest } from "./apiService";

export const getPortfolio = () => {
  return getRequest("/portfolio");
};

export const getPortfolioSummary = () => {
  return getRequest("/portfolio/summary");
};

