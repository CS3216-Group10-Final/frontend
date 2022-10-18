import axios from "axios";
import { NotificationProps, showErrorNotification } from "utils/notifications";

/**
 * Defines the types of possible errors
 */
export enum ErrorType {
  UNKNOWN,
  SERVER_CONNECTION_FAILED,
  USERNAME_IN_USE,
  EMAIL_IN_USE,
  INCORRECT_LOGIN_DETAILS,
  TOKEN_NOT_VALID,
}

/**
 * Format provided by REST Api
 */
interface UnauthorizedError {
  detail: string;
  code: string;
}

/**
 * Error codes provided by REST Api
 */
const ERROR_CODE_INVALID_TOKEN = "token_not_valid";

export type ApiRequestError = {
  errorType: ErrorType;
  errorMessage?: string;
};

export function handleApiRequestError(error: unknown): ApiRequestError {
  if ((error as ApiRequestError).errorType) {
    return error as ApiRequestError;
  }
  if (axios.isAxiosError(error)) {
    if (error.response) {
      if (error.response.status == 401) {
        const unauthorizedError = error.response.data as UnauthorizedError;
        if (unauthorizedError.code == ERROR_CODE_INVALID_TOKEN) {
          return { errorType: ErrorType.TOKEN_NOT_VALID };
        }
      }
      console.log("API request error: ", error.message);
      return { errorType: ErrorType.UNKNOWN };
    } else if (error.request) {
      return { errorType: ErrorType.UNKNOWN };
    } else {
      console.log("API Request error:", error.message);
      return { errorType: ErrorType.UNKNOWN };
    }
  } else if (error instanceof Error) {
    console.log("API request error: ", error.message);
    return { errorType: ErrorType.UNKNOWN };
  } else {
    console.log("API request error: ", error);
    return { errorType: ErrorType.UNKNOWN };
  }
}

const ERROR_DETAILS: Record<ErrorType, NotificationProps> = {
  [ErrorType.UNKNOWN]: { title: "Oops!", message: "An unkown error occurred" },
  [ErrorType.SERVER_CONNECTION_FAILED]: {
    title: "Server error",
    message: "Could not contact server",
  },
  [ErrorType.USERNAME_IN_USE]: {
    title: "Username has been taken by someone else",
    message: "Oh no, the username has already been taken :(",
  },
  [ErrorType.EMAIL_IN_USE]: {
    title: "Email has been taken by someone else",
    message: "Oh no, the email has already been taken :(",
  },
  [ErrorType.INCORRECT_LOGIN_DETAILS]: {
    title: "Invalid Credential",
    message: "Oh no, cannot login with the provided credentials :(",
  },
  [ErrorType.TOKEN_NOT_VALID]: {
    title: "Authentication Error",
    message: "Please login again",
  },
};

export function showApiRequestErrorNotification(error: ApiRequestError) {
  showErrorNotification(ERROR_DETAILS[error.errorType]);
}
