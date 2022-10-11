import axiosInstance from "./axios";
import { USER_PATH } from "./endpoint_paths";
import { User } from "./types";

export async function updateUserProfilePictureApi(image: File): Promise<User> {
  const form_data = new FormData();
  form_data.append("profile_picture_link", image, image.name);
  const response = await axiosInstance.patch<User>(USER_PATH, form_data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
