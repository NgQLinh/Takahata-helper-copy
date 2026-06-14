import { Account } from "@/app/types/user/User";
import { apiClient } from "@/app/services/common/apiClient";
import { CreateAccountRequest } from "@/app/types/user/CreateUserRequest";

export const getAccountsAsync = async (): Promise<Account[]> => {
  const response = await apiClient.post("/Account/query-accounts");
  return response.data;
};

export const createUserAsync = async (
  data: CreateAccountRequest,
): Promise<Account> => {
  const response = await apiClient.post("/Account/create", data);
  return response.data;
};
