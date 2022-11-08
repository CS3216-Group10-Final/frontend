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
  release_years?: number[];
  platforms?: string[];
  genres?: string[];
}

interface GetGameListResponse {
  games: Game[];
  totalPage?: number;
}

export async function getGameListApi({
  page,
  query,
  release_years,
  platforms,
  genres,
}: GameListParams): Promise<GetGameListResponse> {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", String(page));
  }
  if (query) {
    params.append("query", query);
  }
  for (const year of release_years ?? []) {
    params.append("release_year", String(year));
  }
  for (const platform of platforms ?? []) {
    params.append("platform", platform);
  }
  for (const genre of genres ?? []) {
    params.append("genre", genre);
  }

  const response = await axiosInstance.get<Game[]>(GAMES_PATH, {
    params: params,
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
