import { combineReducers } from "@reduxjs/toolkit";
import user from "./slices/User_slice";
import gameEntry from "./slices/GameEntry_slice";
import userStatistics from "./slices/UserStatistics_slice";

const appReducer = combineReducers({
  user,
  gameEntry,
  userStatistics,
});

export const rootReducer: typeof appReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
