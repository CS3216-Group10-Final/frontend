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
