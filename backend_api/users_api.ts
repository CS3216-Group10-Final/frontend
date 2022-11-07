import { ExpectedError } from "./authentication/authentication_api";
import axiosInstance from "./axios";
import {
  getPathForGetUser,
  USER_COLLECTION_PATH,
  USER_PATH,
} from "./endpoint_paths";
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
export async function getUserApi(
  username: string,
  authNotRequired: boolean
): Promise<User> {
  const pathForGetUser = getPathForGetUser(username);
  const response = await axiosInstance.get<User>(
    pathForGetUser,
    authNotRequired
      ? {
          authNotRequired: true,
        }
      : {}
  );
  return response.data;
}

/**
 * Change self user's username
 */
export async function updateSelfUsernameApi(username: string): Promise<User> {
  const response = await axiosInstance.patch<User | ExpectedError>(USER_PATH, {
    username: username,
  });

  const authExpectedError = response.data as ExpectedError;
  if (authExpectedError.error_code == 1) {
    throw {
      errorType: ErrorType.USERNAME_IN_USE,
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
  return response.data as User;
}

export async function updateSelfBioApi(bio: string): Promise<User> {
  const response = await axiosInstance.patch<User>(USER_PATH, {
    bio: bio,
  });
  return response.data;
}

interface UserListParams {
  page: number;
  query: string;
}

export async function getListOfUsersApi({
  page,
  query,
}: UserListParams): Promise<User[]> {
  const response = await axiosInstance.get<User[]>(USER_COLLECTION_PATH, {
    params: {
      ...(page ? { page: page } : {}),
      ...(query ? { query: query } : {}),
    },
    authNotRequired: true,
  });
  return response.data;
}
