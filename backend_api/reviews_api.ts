import axiosInstance from "./axios";
import { REVIEW_PATH } from "./endpoint_paths";
import { ReviewEntry } from "./types";
interface ReviewListParams {
  game_id?: number;
  following_only?: boolean;
  page?: number;
}
export async function getReviewsApi({
  game_id,
  following_only,
  page,
}: ReviewListParams): Promise<ReviewEntry[]> {
  const response = await axiosInstance.get<ReviewEntry[]>(REVIEW_PATH, {
    params: {
      ...(game_id ? { game_id: game_id } : {}),
      ...(following_only ? { following_only: following_only } : {}),
      ...(page ? { page: page } : {}),
    },
    authNotRequired: following_only,
  });
  return response.data;
}
