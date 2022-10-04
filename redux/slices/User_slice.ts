import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
    builder.addCase(updateProfilePic.fulfilled, (state, action) => {
      const newUser = Object.create(state.user);
      state.user = { profile_picture_link: action.payload, ...newUser };
    });
  },
});

export const updateProfilePic = createAsyncThunk<
  void,
  string | undefined,
  { state: RootState }
>("user/updateProfilePic", async (profile_picture_link, thunkApi) => {
  // TODO implement api
  // try {
  //   await updateProfilePicApi(profile_picture_link)
  // } catch (error) {
  //   thunkApi.rejectWithValue(error)
  // }
});

export const getSelfUser = createAsyncThunk<User, void, { state: RootState }>(
  "user/getSelfUser",
  async (_, thunkApi) => {
    // TODO implement api
    // const response = await getSelfUserApi()
    // return response
    return {
      id: 0,
      username: "",
      is_following: false,
      profile_picture_link: "",
    };
  }
);

export default userSlice.reducer;
