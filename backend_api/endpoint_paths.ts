/**
 * API Endpoint paths
 */

// Authentication
export const LOGIN_PATH = "/login";
export const REGISTER_PATH = "/register";
export const LOGOUT_PATH = "/logout";
export const VERIFY_AUTHENTICATION = "/tokens/verify";
export const REFRESH_TOKEN_PATH = "/tokens/refresh";
export const GOOGLE_LOGIN_PATH = "/login/google";

// User
export const USER_PATH = "/user";
export const USER_COLLECTION_PATH = "/users";
export function getPathForGetUser(username: string) {
  return USER_COLLECTION_PATH + "/" + username;
}

// Follow user
export const FOLLOW_PATH = "/follows";
export function getPathForFollowUser(username: string) {
  return FOLLOW_PATH + "/" + username;
}

// User Statistics
export function getPathForUserStatisticsWithName(username: string) {
  return getPathForGetUser(username) + "/stats";
}

// Games
export const GAMES_PATH = "/games";
export function getPathForGameWithId(id: number) {
  return GAMES_PATH + "/" + id;
}

// Game Entries
export const GAME_ENTRIES_PATH = "/game-entries";
export function getPathForGameEntryWithId(id: number) {
  return GAME_ENTRIES_PATH + "/" + id;
}

// Activity
export const ACTIVITY_PATH = "/activities";
export function getPathForUserActivityWithId(id: number) {
  return ACTIVITY_PATH + "/" + id;
}

// Timeline
export const TIMELINE_PATH = "/timeline";

// Reviews
export const REVIEW_PATH = "/reviews";
