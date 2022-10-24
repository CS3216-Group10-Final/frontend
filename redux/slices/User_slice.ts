import { updateUserProfilePictureApi } from "@api/pictures_api";
import { User } from "@api/types";
import {
  getSelfUserApi,
  updateSelfBioApi,
  updateSelfUsernameApi,
} from "@api/users_api";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
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
    builder.addCase(updateBio.fulfilled, (state, action) => {
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
>("user/updateUsername", async (username, { rejectWithValue }) => {
  try {
    const response = await updateSelfUsernameApi(username);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateBio = createAsyncThunk<User, string, { state: RootState }>(
  "user/updateBio",
  async (bio) => {
    const response = await updateSelfBioApi(bio);
    return response;
  }
);

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
export const selectUserBio = createSelector(selectUser, (user) =>
  user?.bio ? user.bio : ""
);

export default userSlice.reducer;
