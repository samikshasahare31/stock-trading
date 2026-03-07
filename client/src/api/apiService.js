import api from "./axiosInstance";

// GET
export const getRequest = (url, params = {}) => {
  return api.get(url, { params });
};

// POST
export const postRequest = (url, data) => {
  return api.post(url, data);
};

// PUT
export const putRequest = (url, data) => {
  return api.put(url, data);
};

// PATCH
export const patchRequest = (url, data) => {
  return api.patch(url, data);
};

// DELETE
export const deleteRequest = (url) => {
  return api.delete(url);
};