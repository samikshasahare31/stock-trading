import { postRequest, getRequest } from "./apiService";

export const registerUser = (data) => {
  return postRequest("/auth/register", data);
};

export const loginUser = (data) => {
  return postRequest("/auth/login", data);
};

export const getCurrentUser = () => {
  return getRequest("/auth/me");
};