import { getRequest } from "./apiService";

export const getLeaderboard = () => {
  return getRequest("/leaderboard");
};
