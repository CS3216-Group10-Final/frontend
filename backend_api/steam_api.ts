import TokenService from "./authentication/token_service";
import axiosInstance from "./axios";
import { STEAM_GAMES_PATH, STEAM_LOGIN_PATH } from "./endpoint_paths";
import { Game, GameEntry, GameEntryStatus } from "./types";

export function getSteamLoginUrl() {
  const accessToken = TokenService.getLocalAccessToken();
  const API_BASE_URL = process.env.NEXT_PUBLIC_BE_ENDPOINT;
  return API_BASE_URL + STEAM_LOGIN_PATH + "?user=" + accessToken;
}

interface GetSteamGamesParams {
  page?: number;
}

interface GetGameListResponse {
  games: Game[];
  totalPage?: number;
}
export async function getSteamGamesApi({
  page,
}: GetSteamGamesParams): Promise<GetGameListResponse> {
  const response = await axiosInstance.get<Game[]>(STEAM_GAMES_PATH, {
    params: {
      ...(page ? { page: page } : {}),
    },
  });
  const pageNumber = response.headers["pages"];
  const totalPage = !Number.isNaN(Number(pageNumber))
    ? Number(pageNumber)
    : undefined;
  return { games: response.data, totalPage: totalPage };
}

interface ImportSteamGamesParams {
  status: GameEntryStatus;
}

export async function importAllSteamGamesApi({
  status,
}: ImportSteamGamesParams): Promise<GameEntry[]> {
  const response = await axiosInstance.post<GameEntry[]>(
    STEAM_GAMES_PATH,
    {},
    {
      params: {
        ...(status ? { status: status } : {}),
      },
    }
  );
  return response.data;
}
