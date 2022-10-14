import axiosInstance from "./axios";
import { getPathForGetUser, USER_PATH } from "./endpoint_paths";
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
  const response = await axiosInstance.patch<User>(USER_PATH, {
    username: username,
  });
  return response.data;
}
