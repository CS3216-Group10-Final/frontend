import axiosInstance from "./axios";
import { getPathForUserActivityWithId, TIMELINE_PATH } from "./endpoint_paths";
import { Activity } from "./types";

interface GetActivityResponse {
  activities: Activity[];
  totalPage?: number;
}

export async function getUserActivityByIdApi(
  id: number,
  page?: number
): Promise<GetActivityResponse> {
  const response = await axiosInstance.get<Activity[]>(
    getPathForUserActivityWithId(id),
    {
      params: {
        ...(page ? { page: page } : {}),
      },
    }
  );

  const pageNumber = response.headers["pages"];
  const totalPage = !Number.isNaN(Number(pageNumber))
    ? Number(pageNumber)
    : undefined;
  return { activities: response.data, totalPage: totalPage };
}

interface TimelineProps {
  game_id?: number;
  username?: string;
  query?: string;
  page?: number;
}

export async function getSelfTimelineApi({
  game_id,
  username,
  query,
  page,
}: TimelineProps): Promise<GetActivityResponse> {
  const response = await axiosInstance.get<Activity[]>(TIMELINE_PATH, {
    params: {
      ...(game_id ? { game_id: game_id } : {}),
      ...(username ? { username: username } : {}),
      ...(page ? { page: page } : {}),
      ...(query ? { query: query } : {}),
    },
  });

  const pageNumber = response.headers["pages"];
  const totalPage = !Number.isNaN(Number(pageNumber))
    ? Number(pageNumber)
    : undefined;
  return { activities: response.data, totalPage: totalPage };
}
