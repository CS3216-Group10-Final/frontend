import { combineReducers } from "@reduxjs/toolkit";
import user from "./slices/User_slice";
import gameEntry from "./slices/GameEntry_slice";

const rootReducer = combineReducers({
  user,
  gameEntry,
});

export default rootReducer;
