import { LoginReq, LoginRes } from "../../types";
import { apiClient } from "../common/apiClient";

export const loginApi = async (data: LoginReq): Promise<LoginRes> => {
  const response = await apiClient.post<LoginRes>(
    "/Authentication/account-login",
    data,
  );

  return response.data;
};
