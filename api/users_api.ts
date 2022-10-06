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
export async function getUserApi(userId: number): Promise<User> {
  const pathForGetUser = getPathForGetUser(userId);
  const response = await axiosInstance.get<User>(pathForGetUser);
  return response.data;
}
