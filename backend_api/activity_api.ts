import axiosInstance from "./axios";
import { getPathForUserActivityWithId, TIMELINE_PATH } from "./endpoint_paths";
import { Activity } from "./types";

export async function getUserActivityByIdApi(id: number): Promise<Activity[]> {
  const response = await axiosInstance.get<Activity[]>(
    getPathForUserActivityWithId(id)
  );

  return response.data;
}

export async function getSelfTimelineApi(): Promise<Activity[]> {
  const response = await axiosInstance.get<Activity[]>(TIMELINE_PATH);

  return response.data;
}
