/**
 * API call handlers for authentication.
 */

import { ErrorType } from "@api/error_handling";
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

export interface ExpectedError {
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
  const response = await axiosInstance.post<TokenResponseData | ExpectedError>(
    REGISTER_PATH,
    userRegisterDetails,
    {
      skipAuthRefresh: true,
      authNotRequired: true,
    }
  );
  const tokenResponseData = response.data as TokenResponseData;
  if (tokenResponseData.access && tokenResponseData.refresh) {
    TokenService.setTokens({
      accessToken: tokenResponseData.access,
      refreshToken: tokenResponseData.refresh,
    });
    return;
  }
  const authExpectedError = response.data as ExpectedError;
  if (authExpectedError.error_code == 1) {
    throw {
      errorType: ErrorType.USERNAME_IN_USE,
      errorMessage: authExpectedError.error_message,
    };
  }
  if (authExpectedError.error_code == 2) {
    throw {
      errorType: ErrorType.EMAIL_IN_USE,
      errorMessage: authExpectedError.error_message,
    };
  } else if (authExpectedError.error_code) {
    throw {
      errorType: ErrorType.UNKNOWN,
    };
  }
}

export async function loginApi(userLoginDetails: UserLoginDetails) {
  const response = await axiosInstance.post<TokenResponseData | ExpectedError>(
    LOGIN_PATH,
    userLoginDetails,
    { skipAuthRefresh: true }
  );
  const tokenResponseData = response.data as TokenResponseData;
  if (tokenResponseData.access && tokenResponseData.refresh) {
    TokenService.setTokens({
      accessToken: tokenResponseData.access,
      refreshToken: tokenResponseData.refresh,
    });
    return;
  }
  const authExpectedError = response.data as ExpectedError;
  if (authExpectedError.error_code == 1) {
    throw {
      errorType: ErrorType.INCORRECT_LOGIN_DETAILS,
      errorMessage: authExpectedError.error_message,
    };
  } else if (authExpectedError.error_code == 2) {
    throw {
      errorType: ErrorType.INVALID_USERNAME,
      errorMessage: authExpectedError.error_message,
    };
  } else if (authExpectedError.error_code) {
    throw {
      errorType: ErrorType.UNKNOWN,
    };
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
export async function getGoogleAuthLinkApi(): Promise<string> {
  const response = await axiosInstance.get<{ url: string }>(GOOGLE_LOGIN_PATH);
  return response.data.url;
}
