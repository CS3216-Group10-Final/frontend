import { combineReducers } from "@reduxjs/toolkit";
import user from "./slices/User_slice";
import gameEntry from "./slices/GameEntry_slice";
import userStatistics from "./slices/UserStatistics_slice";

const rootReducer = combineReducers({
  user,
  gameEntry,
  userStatistics,
});

export default rootReducer;
