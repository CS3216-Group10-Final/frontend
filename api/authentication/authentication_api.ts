/**
 * API call handlers for authentication.
 */

import axios, { AxiosRequestConfig } from "axios";
import axiosInstance from "../axios";
import {
  LOGIN_PATH,
  LOGOUT_PATH,
  REFRESH_TOKEN_PATH,
  REGISTER_PATH,
  VERIFY_AUTHENTICATION,
} from "../endpoint_paths";
import TokenService from "./token_service";

interface TokenResponseData {
  access: string;
  refresh: string;
}

export interface UserLoginDetails {
  email: string;
  password: string;
}

export interface UserRegisterDetails {
  email: string;
  username: string;
  password: string;
}

export async function registerUserApi(
  userRegisterDetails: UserRegisterDetails
) {
  const response = await axiosInstance.post<TokenResponseData>(
    REGISTER_PATH,
    userRegisterDetails,
    { skipAuthRefresh: true } as AxiosRequestConfig
  );
  const tokenResponseData = response.data as TokenResponseData;
  if (tokenResponseData.access && tokenResponseData.refresh) {
    TokenService.setTokens({
      accessToken: tokenResponseData.access,
      refreshToken: tokenResponseData.refresh,
    });
  }
}

export async function loginApi(userLoginDetails: UserLoginDetails) {
  const response = await axiosInstance.post<TokenResponseData>(
    LOGIN_PATH,
    userLoginDetails,
    { skipAuthRefresh: true } as AxiosRequestConfig
  );
  const tokenResponseData = response.data as TokenResponseData;
  if (tokenResponseData.access && tokenResponseData.refresh) {
    TokenService.setTokens({
      accessToken: tokenResponseData.access,
      refreshToken: tokenResponseData.refresh,
    });
  }
}

export async function refreshTokensApi() {
  const response = await axiosInstance.post<TokenResponseData>(
    REFRESH_TOKEN_PATH,
    { refresh: TokenService.getLocalRefreshToken() },
    { skipAuthRefresh: true } as AxiosRequestConfig
  );
  const tokenResponseData = response.data;
  TokenService.setTokens({
    accessToken: tokenResponseData.access,
    refreshToken: tokenResponseData.refresh,
  });
}

export async function logoutApi() {
  const refreshToken = TokenService.getLocalRefreshToken();
  TokenService.removeTokens();
  await axiosInstance.post(LOGOUT_PATH, { refresh: refreshToken }, {
    skipAuthRefresh: true,
  } as AxiosRequestConfig);
}

/**
 * Returns true if the user is currently authenticated with their token.
 */
export async function verifyAuthApi() {
  try {
    await axiosInstance.post(VERIFY_AUTHENTICATION, {
      token: TokenService.getLocalAccessToken(),
    });
    return true;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      return false;
    }
    throw err;
  }
}
