import { combineReducers } from "@reduxjs/toolkit";
import gameEntry from "./slices/GameEntry_slice";
import user from "./slices/User_slice";

const appReducer = combineReducers({
  user,
  gameEntry,
});

export const rootReducer: typeof appReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
