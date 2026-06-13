import { LoginReq, LoginRes } from "@/app/types";
import { apiClient } from "../common/apiClient";

export const loginAsync = async (data: LoginReq): Promise<LoginRes> => {
  const response = await apiClient.post<LoginRes>(
    "/Authentication/login",
    data,
  );

  return response.data;
};
