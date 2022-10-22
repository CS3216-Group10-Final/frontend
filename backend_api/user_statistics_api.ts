import axiosInstance from "./axios";
import { getPathForUserStatisticsWithName } from "./endpoint_paths";
import { UserStatistics } from "./types";

export async function getUserStatisticsByNameApi(
  username: string
): Promise<UserStatistics> {
  const response = await axiosInstance.get<UserStatistics>(
    getPathForUserStatisticsWithName(username)
  );
  return response.data;
}
