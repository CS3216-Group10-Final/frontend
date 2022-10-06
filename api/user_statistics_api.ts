import axiosInstance from "./axios";
import { getPathForUserStatisticsWithId } from "./endpoint_paths";
import { UserStatistics } from "./types";

export async function getUserStatisticsByIdApi(
  id: number
): Promise<UserStatistics> {
  const response = await axiosInstance.get<UserStatistics>(
    getPathForUserStatisticsWithId(id)
  );
  return response.data;
}
