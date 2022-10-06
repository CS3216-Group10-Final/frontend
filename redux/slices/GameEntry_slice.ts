import {
  createGameEntryApi,
  deleteGameEntryApi,
  getGameEntryListApi,
  updateGameEntryApi,
} from "@api/game_entries_api";
import { GameEntry, GameEntryStatus } from "@api/types";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
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
      const newEntries: Record<number, GameEntry> = Object.create(
        state.gameEntries
      );
      newEntries[action.payload.game_id] = action.payload;
      state.gameEntries = newEntries;
    });
    builder.addCase(updateGameEntry.fulfilled, (state, action) => {
      const newEntries: Record<number, GameEntry> = Object.create(
        state.gameEntries
      );
      newEntries[action.meta.arg.game_id] = action.meta.arg;
      state.gameEntries = newEntries;
    });
    builder.addCase(changeGameEntryStatus.fulfilled, (state, action) => {
      const newEntries: Record<number, GameEntry> = Object.create(
        state.gameEntries
      );
      newEntries[action.meta.arg.gameEntry.game_id] = action.meta.arg.gameEntry;
      state.gameEntries = newEntries;
    });
    builder.addCase(deleteGameEntry.fulfilled, (state, action) => {
      const newEntries: Record<number, GameEntry> = Object.create(
        state.gameEntries
      );
      delete newEntries[action.meta.arg];
      state.gameEntries = newEntries;
    });
  },
});

export const getGameEntries = createAsyncThunk<
  GameEntry[],
  { page?: number; query?: string; user_id?: number; game_id?: number },
  { state: RootState }
>("gameEntry/getGameEntries", async ({ page, query, user_id, game_id }) => {
  const response = await getGameEntryListApi(page, query, user_id, game_id);
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
): Record<number, GameEntry> {
  const newEntries: Record<number, GameEntry> = Object.create(gameEntries);
  for (const key in Object.keys(newEntries)) {
    if (newEntries[key].status != status) {
      delete newEntries[key];
    }
  }
  return newEntries;
}

export const selectAllGameEntries = (state: RootState) =>
  state.gameEntry.gameEntries;
export const selectWishlistGameEntries = createSelector(
  selectAllGameEntries,
  (gameEntries) =>
    filterGameEntriesByStatus(gameEntries, GameEntryStatus.WISHLIST)
);
export const selectBacklogGameEntries = createSelector(
  selectAllGameEntries,
  (gameEntries) =>
    filterGameEntriesByStatus(gameEntries, GameEntryStatus.BACKLOG)
);
export const selectPlayingGameEntries = createSelector(
  selectAllGameEntries,
  (gameEntries) =>
    filterGameEntriesByStatus(gameEntries, GameEntryStatus.PLAYING)
);
export const selectCompletedGameEntries = createSelector(
  selectAllGameEntries,
  (gameEntries) =>
    filterGameEntriesByStatus(gameEntries, GameEntryStatus.COMPLETED)
);
export const selectDroppedGameEntries = createSelector(
  selectAllGameEntries,
  (gameEntries) =>
    filterGameEntriesByStatus(gameEntries, GameEntryStatus.DROPPED)
);

export default gameEntrySlice.reducer;
