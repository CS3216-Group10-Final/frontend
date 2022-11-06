import TokenService from "./authentication/token_service";
import { STEAM_LOGIN_PATH } from "./endpoint_paths";

export function getSteamLoginUrl() {
  const accessToken = TokenService.getLocalAccessToken();
  const API_BASE_URL = process.env.NEXT_PUBLIC_BE_ENDPOINT;
  return API_BASE_URL + STEAM_LOGIN_PATH + "?user=" + accessToken;
}
