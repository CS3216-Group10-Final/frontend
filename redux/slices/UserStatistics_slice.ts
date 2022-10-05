import { GameEntryStatus, Genre, Platform, UserStatistics } from "@api/types";
import { getUserStatisticsByIdApi } from "@api/user_statistics_api";
import store, { RootState } from "@redux/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UserStatisticsState {
  userStatistics: UserStatistics;
}

const initialState: UserStatisticsState = {
  userStatistics: {
    average_rating: 0,
    game_status_distribution: {} as Record<GameEntryStatus, number>,
    game_genre_distribution: {} as Record<Genre, number>,
    platform_distribution: {} as Record<Platform, number>,
    release_year_distribution: {},
    play_year_distribution: {},
  },
};

const userStatisticsSlice = createSlice({
  name: "userStatistics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSelfUserStatistics.fulfilled, (state, action) => {
      state.userStatistics = action.payload;
    });
  },
});

const getSelfUserStatistics = createAsyncThunk<
  UserStatistics,
  void,
  { state: RootState }
>("userStatistics/getUserStatisticsById", async () => {
  const selfId = store.getState().user.user.id;
  const response = await getUserStatisticsByIdApi(selfId);
  return response;
});

export default userStatisticsSlice.reducer;
