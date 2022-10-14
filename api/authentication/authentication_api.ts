/**
 * API call handlers for authentication.
 */

import { ApiRequestError, ErrorType } from "@api/error_handling";
import axios from "axios";
import axiosInstance from "../axios";
import {
  GOOGLE_LOGIN_PATH,
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

interface AuthExpectedError {
  error_code: number;
  error_message: string;
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
  const response = await axiosInstance.post<
    TokenResponseData | AuthExpectedError
  >(REGISTER_PATH, userRegisterDetails, {
    skipAuthRefresh: true,
    authNotRequired: true,
  });
  const tokenResponseData = response.data as TokenResponseData;
  if (tokenResponseData.access && tokenResponseData.refresh) {
    TokenService.setTokens({
      accessToken: tokenResponseData.access,
      refreshToken: tokenResponseData.refresh,
    });
    return;
  }
  const authExpectedError = response.data as AuthExpectedError;
  if (authExpectedError.error_code == 1) {
    throw new ApiRequestError(
      ErrorType.USERNAME_IN_USE,
      authExpectedError.error_message
    );
  }
  if (authExpectedError.error_code == 2) {
    throw new ApiRequestError(
      ErrorType.EMAIL_IN_USE,
      authExpectedError.error_message
    );
  }
}

export async function loginApi(userLoginDetails: UserLoginDetails) {
  const response = await axiosInstance.post<
    TokenResponseData | AuthExpectedError
  >(LOGIN_PATH, userLoginDetails, { skipAuthRefresh: true });
  const tokenResponseData = response.data as TokenResponseData;
  if (tokenResponseData.access && tokenResponseData.refresh) {
    TokenService.setTokens({
      accessToken: tokenResponseData.access,
      refreshToken: tokenResponseData.refresh,
    });
    return;
  }
  const authExpectedError = response.data as AuthExpectedError;
  if (authExpectedError.error_code == 1) {
    throw new ApiRequestError(
      ErrorType.INCORRECT_LOGIN_DETAILS,
      authExpectedError.error_message
    );
  }
}

export async function refreshTokensApi() {
  const response = await axiosInstance.post<TokenResponseData>(
    REFRESH_TOKEN_PATH,
    { refresh: TokenService.getLocalRefreshToken() },
    { skipAuthRefresh: true }
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
  await axiosInstance.post(
    LOGOUT_PATH,
    { refresh: refreshToken },
    {
      skipAuthRefresh: true,
    }
  );
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

/**
 * Gets google auth link
 */
export async function getGoogleAuthLink(): Promise<string> {
  const response = await axiosInstance.get<{ url: string }>(GOOGLE_LOGIN_PATH);
  return response.data.url;
}
