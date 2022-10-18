/**
 * Create custom instance of Axios for intercepting and injecting headers like authorization.
 */
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { refreshTokensApi } from "./authentication/authentication_api";
import TokenService from "./authentication/token_service";

const API_BASE_URL = process.env.NEXT_PUBLIC_BE_ENDPOINT;

declare module "axios" {
  export interface AxiosRequestConfig {
    authNotRequired?: boolean;
    skipAuthRefresh?: boolean;
  }
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token && !config.authNotRequired) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

createAuthRefreshInterceptor(axiosInstance, refreshTokensApi);

export function getFullURL(url: string): string {
  return API_BASE_URL + url;
}

export default axiosInstance;
