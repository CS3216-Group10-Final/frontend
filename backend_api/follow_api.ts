import axiosInstance from "./axios";
import { getPathForFollowUser } from "./endpoint_paths";

export async function followUserApi(username: string) {
  const followPath = getPathForFollowUser(username);
  const response = await axiosInstance.post(followPath);
  return response.data;
}

export async function unfollowUserApi(username: string) {
  const followPath = getPathForFollowUser(username);
  const response = await axiosInstance.delete(followPath);
  return response.data;
}
