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

interface AuthenticationResponse {
  error_message?: string;
}

export async function registerUser(userRegisterDetails: UserLoginDetails) {
  const response = await axiosInstance.post<AuthenticationResponse>(
    REGISTER_PATH,
    userRegisterDetails
  );
  return response.data;
}

export async function login(userLoginDetails: UserLoginDetails) {
  const response = await axiosInstance.post<AuthenticationResponse>(
    LOGIN_PATH,
    userLoginDetails,
    { skipAuthRefresh: true } as AxiosRequestConfig
  );
  const tokenResponseData = response.data as TokenResponseData;
  TokenService.setTokens({
    accessToken: tokenResponseData.access,
    refreshToken: tokenResponseData.refresh,
  });
  return response.data;
}

export async function refreshTokens() {
  const response = await axiosInstance.post<TokenResponseData>(
    REFRESH_TOKEN_PATH,
    {
      refresh: TokenService.getLocalRefreshToken(),
    },
    {
      skipAuthRefresh: true,
    } as AxiosRequestConfig
  );
  const tokenResponseData = response.data;
  TokenService.setTokens({
    accessToken: tokenResponseData.access,
    refreshToken: tokenResponseData.refresh,
  });
}

export async function logout() {
  const refreshToken = TokenService.getLocalRefreshToken();
  TokenService.removeTokens();
  await axiosInstance.post(LOGOUT_PATH, {
    refresh: refreshToken,
  });
}
