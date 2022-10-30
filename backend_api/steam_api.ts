import TokenService from "./authentication/token_service";
import axiosInstance from "./axios";
import { STEAM_LOGIN_PATH } from "./endpoint_paths";

export async function loginSteamApi() {
  const accessToken = TokenService.getLocalAccessToken();
  const response = await axiosInstance.get(STEAM_LOGIN_PATH, {
    params: {
      user: accessToken,
    },
  });
  return response.data;
}
