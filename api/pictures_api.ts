import axiosInstance from "./axios";
import { USER_PATH } from "./endpoint_paths";

export async function updateUserProfilePictureApi(
  image: File
): Promise<string> {
  const form_data = new FormData();
  form_data.append("profile_pic", image, image.name);
  const response = await axiosInstance.patch<string>(USER_PATH, form_data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
