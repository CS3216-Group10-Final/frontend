import axiosInstance from "./axios";
import { getPathForUserActivityWithId } from "./endpoint_paths";
import { Activity } from "./types";

export async function getUserActivityByIdApi(id: number): Promise<Activity[]> {
  const response = await axiosInstance.get<Activity[]>(
    getPathForUserActivityWithId(id)
  );

  return response.data;
}
