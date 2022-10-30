import {
  createGameEntryApi,
  deleteGameEntryApi,
  getGameEntryListApi,
  updateGameEntryApi,
} from "@api/game_entries_api";
import { GameEntry, GameEntryStatus } from "@api/types";
import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface GameEntryState {
  gameEntries: Record<number, GameEntry>;
}

const initialState: GameEntryState = {
  gameEntries: {},
};

const gameEntrySlice = createSlice({
  name: "gameEntry",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGameEntries.fulfilled, (state, action) => {
      const newEntries: Record<number, GameEntry> = {};
      for (const gameEntry of action.payload) {
        newEntries[gameEntry.id] = gameEntry;
      }
      state.gameEntries = newEntries;
    });
    builder.addCase(createGameEntry.fulfilled, (state, action) => {
      const newEntries: Record<number, GameEntry> = {};
      const currentEntries = current(state.gameEntries);
      for (const id of Object.keys(currentEntries)) {
        newEntries[Number(id)] = currentEntries[Number(id)];
      }
      newEntries[action.payload.id] = action.payload;
      state.gameEntries = newEntries;
    });
    builder.addCase(updateGameEntry.fulfilled, (state, action) => {
      const newEntries: Record<number, GameEntry> = {};
      const currentEntries = current(state.gameEntries);
      for (const id of Object.keys(currentEntries)) {
        if (Number(id) === action.meta.arg.id) {
          newEntries[Number(id)] = action.meta.arg;
          continue;
        }
        newEntries[Number(id)] = currentEntries[Number(id)];
      }
      state.gameEntries = newEntries;
    });
    builder.addCase(changeGameEntryStatus.fulfilled, (state, action) => {
      const newEntries: Record<number, GameEntry> = {};
      const currentEntries = current(state.gameEntries);
      for (const id of Object.keys(currentEntries)) {
        if (Number(id) === action.meta.arg.gameEntry.id) {
          newEntries[Number(id)] = {
            ...action.meta.arg.gameEntry,
            status: action.meta.arg.newStatus,
          };
          continue;
        }
        newEntries[Number(id)] = currentEntries[Number(id)];
      }
      state.gameEntries = newEntries;
    });
    builder.addCase(updateGameEntryFavorite.fulfilled, (state, action) => {
      const newEntries: Record<number, GameEntry> = {};
      const currentEntries = current(state.gameEntries);
      for (const id of Object.keys(currentEntries)) {
        if (Number(id) === action.meta.arg.gameEntry.id) {
          newEntries[Number(id)] = {
            ...action.meta.arg.gameEntry,
            is_favourite: action.meta.arg.isFavorite,
          };
          continue;
        }
        newEntries[Number(id)] = currentEntries[Number(id)];
      }
      state.gameEntries = newEntries;
    });
    builder.addCase(deleteGameEntry.fulfilled, (state, action) => {
      const newEntries: Record<number, GameEntry> = {};
      const currentEntries = current(state.gameEntries);
      for (const id of Object.keys(currentEntries)) {
        if (Number(id) === action.meta.arg) {
          continue;
        }
        newEntries[Number(id)] = currentEntries[Number(id)];
      }
      state.gameEntries = newEntries;
    });
  },
});

export const getGameEntries = createAsyncThunk<
  GameEntry[],
  { page?: number; query?: string; user_id?: number; game_id?: number },
  { state: RootState }
>("gameEntry/getGameEntries", async ({ page, query, user_id, game_id }) => {
  const response: GameEntry[] = await getGameEntryListApi({
    page,
    query,
    user_id,
    game_id,
  });
  return response;
});

export const createGameEntry = createAsyncThunk<
  GameEntry,
  GameEntry,
  { state: RootState }
>("gameEntry/createGameEntry", async (gameEntry) => {
  const response = await createGameEntryApi(gameEntry);
  return response;
});

export const updateGameEntry = createAsyncThunk<
  void,
  GameEntry,
  { state: RootState }
>("gameEntry/updateGameEntry", async (gameEntry) => {
  await updateGameEntryApi(gameEntry);
});

export const changeGameEntryStatus = createAsyncThunk<
  void,
  { gameEntry: GameEntry; newStatus: GameEntryStatus },
  { state: RootState }
>("gameEntry/changeGameEntryStatus", async ({ gameEntry, newStatus }) => {
  const newGameEntry: GameEntry = { ...gameEntry, status: newStatus };
  await updateGameEntryApi(newGameEntry);
});

export const updateGameEntryFavorite = createAsyncThunk<
  void,
  { gameEntry: GameEntry; isFavorite: boolean },
  { state: RootState }
>("gameEntry/updateGameEntryFavorite", async ({ gameEntry, isFavorite }) => {
  const newGameEntry: GameEntry = { ...gameEntry, is_favourite: isFavorite };
  await updateGameEntryApi(newGameEntry);
});

export const deleteGameEntry = createAsyncThunk<
  void,
  number,
  { state: RootState }
>("gameEntry/deleteGameEntry", async (id) => {
  await deleteGameEntryApi(id);
});

function filterGameEntriesByStatus(
  gameEntries: Record<number, GameEntry>,
  status: GameEntryStatus
): GameEntry[] {
  return Object.values(gameEntries).filter((value) => value.status === status);
}

export function getAllGameEntriesFiltered(
  gameEntries: Record<number, GameEntry>
): Record<GameEntryStatus, GameEntry[]> {
  const allFilteredGames = {
    [GameEntryStatus.WISHLIST]: filterGameEntriesByStatus(
      gameEntries,
      GameEntryStatus.WISHLIST
    ),
    [GameEntryStatus.BACKLOG]: filterGameEntriesByStatus(
      gameEntries,
      GameEntryStatus.BACKLOG
    ),
    [GameEntryStatus.PLAYING]: filterGameEntriesByStatus(
      gameEntries,
      GameEntryStatus.PLAYING
    ),
    [GameEntryStatus.COMPLETED]: filterGameEntriesByStatus(
      gameEntries,
      GameEntryStatus.COMPLETED
    ),
    [GameEntryStatus.DROPPED]: filterGameEntriesByStatus(
      gameEntries,
      GameEntryStatus.DROPPED
    ),
  };
  return allFilteredGames;
}

export const selectAllGameEntries = (state: RootState) =>
  state.gameEntry.gameEntries;

export const selectAllGameEntriesFiltered = (state: RootState) => {
  return getAllGameEntriesFiltered(state.gameEntry.gameEntries);
};

export const selectSelfHasGames = (state: RootState) => {
  return Object.values(state.gameEntry.gameEntries).length > 0;
};

export const selectGameEntryByGameId = (state: RootState, id: number) => {
  const gameEntries = Object.values(state.gameEntry.gameEntries).filter(
    (gameEntry) => gameEntry.game_id === id
  );

  return gameEntries.length > 0 ? gameEntries[0] : undefined;
};

export default gameEntrySlice.reducer;
