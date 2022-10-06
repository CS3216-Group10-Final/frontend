import axios from "axios";

/**
 * Defines the types of possible errors
 */
export enum ErrorType {
  UNKNOWN,
  SERVER_CONNECTION_FAILED,
  USERNAME_IN_USE,
  EMAIL_IN_USE,
  INCORRECT_LOGIN_DETAILS,
  TOKEN_NOT_VALID
}

/**
 * Format provided by REST Api
 */
interface UnauthorizedError {
  detail: string
  code: string
}

/**
 * Error codes provided by REST Api
 */
const ERROR_CODE_INVALID_TOKEN = "token_not_valid"

export class ApiRequestError extends Error {
  errorType: ErrorType;
  constructor(errorType: number, errorMessage?: string) {
    super(errorMessage);
    this.errorType = errorType;
  }
}

export function handleApiRequestError(error: unknown): ApiRequestError {
  if (error instanceof ApiRequestError) {
    return error
  }
  if (axios.isAxiosError(error)) {
    if (error.response) {
      if (error.response.status == 401) {
        const unauthorizedError = error.response.data as UnauthorizedError
        if (unauthorizedError.code == ERROR_CODE_INVALID_TOKEN) {
          return new ApiRequestError(ErrorType.TOKEN_NOT_VALID)
        }
      }
      console.log('API request error: ', error.message);
      return new ApiRequestError(ErrorType.UNKNOWN)
    } else if (error.request) {
      return new ApiRequestError(ErrorType.SERVER_CONNECTION_FAILED)
    } else {
      console.log('API Request error:', error.message)
      return new ApiRequestError(ErrorType.UNKNOWN)
    }
  } else if (error instanceof Error) {
    console.log('API request error: ', error.message);
    return new ApiRequestError(ErrorType.UNKNOWN);
  } else {
    console.log('API request error: ', error);
    return new ApiRequestError(ErrorType.UNKNOWN);
  }
}