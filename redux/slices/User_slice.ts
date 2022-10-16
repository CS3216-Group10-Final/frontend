import { updateUserProfilePictureApi } from "@api/pictures_api";
import { getSelfUserApi, updateSelfUsernameApi } from "@api/users_api";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { User } from "../../api/types";
import { RootState } from "../store";

interface UserState {
  user?: User;
}

const initialState: UserState = {
  user: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSelfUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(updateProfilePic.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(updateUsername.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const updateProfilePic = createAsyncThunk<
  User,
  File,
  { state: RootState }
>("user/updateProfilePic", async (profile_picture) => {
  const response = await updateUserProfilePictureApi(profile_picture);
  return response;
});

export const updateUsername = createAsyncThunk<
  User,
  string,
  { state: RootState }
>("user/updateUsername", async (username) => {
  const response = await updateSelfUsernameApi(username);
  return response;
});

export const getSelfUser = createAsyncThunk<User, void, { state: RootState }>(
  "user/getSelfUser",
  async () => {
    const response = await getSelfUserApi();
    return response;
  }
);

export const selectUser = (state: RootState) => state.user.user;
export const selectUserId = createSelector(selectUser, (user) =>
  user ? user.id : -1
);

export default userSlice.reducer;
