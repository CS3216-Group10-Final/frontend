import { updateUserProfilePictureApi } from "@api/pictures_api";
import { getSelfUserApi } from "@api/users_api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../api/types";
import { RootState } from "../store";

interface UserState {
  user: User;
}

const initialState: UserState = {
  user: {
    id: 0,
    username: "",
    is_following: false,
    profile_picture_link: "",
  },
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
      const newUser = Object.create(state.user);
      state.user = { profile_picture_link: action.payload, ...newUser };
    });
  },
});

export const updateProfilePic = createAsyncThunk<
  string,
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

export default userSlice.reducer;
