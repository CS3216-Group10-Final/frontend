import { UserStatistics } from "@api/types";
import { getUserStatisticsByNameApi } from "@api/user_statistics_api";
import store, { RootState } from "@redux/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { selectUser } from "./User_slice";

interface UserStatisticsState {
  userStatistics: UserStatistics | undefined;
}

const initialState: UserStatisticsState = {
  userStatistics: undefined,
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

export const getSelfUserStatistics = createAsyncThunk<
  UserStatistics | undefined,
  void,
  { state: RootState }
>("userStatistics/getSelfUserStatistics", async () => {
  const selfUser = selectUser(store.getState());
  if (selfUser) {
    const selfUsername = selfUser.username;
    const response = await getUserStatisticsByNameApi(selfUsername);
    return response;
  } else {
    return undefined;
  }
});

export const selectUserStatistics = (state: RootState) =>
  state.userStatistics.userStatistics;

export default userStatisticsSlice.reducer;
