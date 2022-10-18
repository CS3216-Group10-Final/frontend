import { AuthExpectedError } from "./authentication/authentication_api";
import axiosInstance from "./axios";
import { getPathForGetUser, USER_PATH } from "./endpoint_paths";
import { ErrorType } from "./error_handling";
import { User } from "./types";

/**
 * Gets self User object
 */
export async function getSelfUserApi(): Promise<User> {
  const response = await axiosInstance.get<User>(USER_PATH);
  return response.data;
}

/**
 * Gets User object by user id
 */
export async function getUserApi(username: string): Promise<User> {
  const pathForGetUser = getPathForGetUser(username);
  const response = await axiosInstance.get<User>(pathForGetUser, {
    authNotRequired: true,
  });
  return response.data;
}

/**
 * Change self user's username
 */
export async function updateSelfUsernameApi(username: string): Promise<User> {
  const response = await axiosInstance.patch<User | AuthExpectedError>(
    USER_PATH,
    {
      username: username,
    }
  );

  const authExpectedError = response.data as AuthExpectedError;
  if (authExpectedError.error_code == 1) {
    throw {
      errorType: ErrorType.USERNAME_IN_USE,
      errorMessage: authExpectedError.error_message,
    };
  } else if (authExpectedError.error_code) {
    throw {
      errorType: ErrorType.UNKNOWN,
    };
  }
  return response.data as User;
}
