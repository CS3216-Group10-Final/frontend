import axiosInstance from "./axios";
import { GAMES_PATH, getPathForGameWithId } from "./endpoint_paths";
import { Game } from "./types";

export async function getGameByIdApi(id: number): Promise<Game> {
  const response = await axiosInstance.get<Game>(getPathForGameWithId(id));
  return response.data;
}

export async function getGameListApi(
  page?: number,
  query?: string
): Promise<Game[]> {
  const response = await axiosInstance.get<Game[]>(GAMES_PATH, {
    params: {
      ...(page ? { page: page } : {}),
      ...(query ? { query: query } : {}),
    },
  });
  return response.data;
}
