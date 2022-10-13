import axiosInstance from "./axios";
import { GAME_ENTRIES_PATH, getPathForGameEntryWithId } from "./endpoint_paths";
import { GameEntry } from "./types";

export async function getGameEntryByIdApi(id: number): Promise<GameEntry> {
  const response = await axiosInstance.get<GameEntry>(
    getPathForGameEntryWithId(id)
  );
  return response.data;
}

interface GameEntryListParams {
  page?: number;
  query?: string;
  user_id?: number;
  game_id?: number;
}

export async function getGameEntryListApi({
  page,
  query,
  user_id,
  game_id,
}: GameEntryListParams): Promise<GameEntry[]> {
  const response = await axiosInstance.get<GameEntry[]>(GAME_ENTRIES_PATH, {
    params: {
      ...(page ? { page: page } : {}),
      ...(query ? { query: query } : {}),
      ...(user_id ? { user_id: user_id } : {}),
      ...(game_id ? { game_id: game_id } : {}),
    },
  });
  return response.data;
}

export async function createGameEntryApi(
  gameEntry: GameEntry
): Promise<GameEntry> {
  const response = await axiosInstance.post<GameEntry>(
    GAME_ENTRIES_PATH,
    gameEntry
  );
  return response.data;
}

export async function updateGameEntryApi(gameEntry: GameEntry) {
  await axiosInstance.put(getPathForGameEntryWithId(gameEntry.id), gameEntry);
}

export async function deleteGameEntryApi(id: number) {
  await axiosInstance.delete(getPathForGameEntryWithId(id));
}
