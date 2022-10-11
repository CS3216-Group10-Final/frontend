import { updateUserProfilePictureApi } from "@api/pictures_api";
import { getSelfUserApi } from "@api/users_api";
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
      state.user.profile_picture_link = `${process.env.NEXT_PUBLIC_BE_ENDPOINT}${action.payload.profile_picture_link}`;
    });
    builder.addCase(updateProfilePic.fulfilled, (state, action) => {
      if (state.user) {
        const newUser = Object.create(state.user);
        const { profile_picture_link } = action.payload;

        state.user = {
          ...action.payload,
          ...newUser,
          profile_picture_link: `${process.env.NEXT_PUBLIC_BE_ENDPOINT}${profile_picture_link}`,
        };
      }
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
