import { LoginRequest, LoginResponse } from "@/app/types";
import { apiClient } from "../common/apiClient";

export const loginAsync = async (
  data: LoginRequest,
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    "/Authentication/login",
    data,
  );

  return response.data;
};
