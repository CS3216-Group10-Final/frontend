/**
 * API Endpoint paths
 */

// Authentication
export const LOGIN_PATH = "/login";
export const REGISTER_PATH = "/register";
export const LOGOUT_PATH = "/logout";
export const VERIFY_AUTHENTICATION = "/token/verify";
export const REFRESH_TOKEN_PATH = "/token/refresh";

// User
export const USER_PATH = "/user";
export function getPathForGetUser(id: number) {
  return USER_PATH + "/" + id;
}
export const PROFILE_PICTURE_PATH = "/user/picture";

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

// User Statistics
export const USER_STATISTICS_PATH = "/userstats";
export function getPathForUserStatisticsWithId(id: number) {
  return USER_STATISTICS_PATH + "/" + id;
}
