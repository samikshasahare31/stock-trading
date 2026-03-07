import { getRequest, postRequest, putRequest, deleteRequest } from "./apiService";

// Users
export const getAdminUsers = () => {
  return getRequest("/admin/users");
};

export const getAdminUser = (userId) => {
  return getRequest(`/admin/users/${userId}`);
};

export const resetUserBalance = (userId) => {
  return putRequest(`/admin/users/${userId}/reset-balance`, {});
};

// Stocks
export const addStock = (stockData) => {
  return postRequest("/admin/stocks", stockData);
};

export const updateStock = (stockId, stockData) => {
  return putRequest(`/admin/stocks/${stockId}`, stockData);
};

export const deleteStock = (stockId) => {
  return deleteRequest(`/admin/stocks/${stockId}`);
};

// Stats
export const getAdminStats = () => {
  return getRequest("/admin/stats");
};
