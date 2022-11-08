import axiosInstance from "./axios";
import {
  GAMES_PATH,
  getPathForGameWithId,
  POPULAR_GAMES_PATH,
} from "./endpoint_paths";
import { Game } from "./types";

export async function getGameByIdApi(id: number): Promise<Game> {
  const response = await axiosInstance.get<Game>(getPathForGameWithId(id), {
    authNotRequired: true,
  });
  return response.data;
}

interface GameListParams {
  page?: number;
  query?: string;
}

interface GetGameListResponse {
  games: Game[];
  totalPage?: number;
}

export async function getGameListApi({
  page,
  query,
}: GameListParams): Promise<GetGameListResponse> {
  const response = await axiosInstance.get<Game[]>(GAMES_PATH, {
    params: {
      ...(page ? { page: page } : {}),
      ...(query ? { query: query } : {}),
    },
    authNotRequired: true,
  });
  const pageNumber = response.headers["pages"];
  const totalPage = !Number.isNaN(Number(pageNumber))
    ? Number(pageNumber)
    : undefined;
  return { games: response.data, totalPage: totalPage };
}

export async function getPopularGameListApi(): Promise<Game[]> {
  const response = await axiosInstance.get<Game[]>(POPULAR_GAMES_PATH, {
    authNotRequired: true,
  });
  return response.data;
}
