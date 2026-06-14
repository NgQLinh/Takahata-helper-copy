import { Account } from "@/app/types/account/Account";
import { apiClient } from "@/app/services/common/apiClient";
import { CreateAccountRequest } from "@/app/types/account/CreateAccountRequest";
import { DeleteAccountRequest } from "@/app/types/account/DeleteAccountRequest";
import { UpdateAccountRequest } from "@/app/types/account/UpdateAccountRequest";

export const getAccountsAsync = async (): Promise<Account[]> => {
  const response = await apiClient.post("/Account/query-accounts");
  return response.data;
};

export const createAccountAsync = async (
  data: CreateAccountRequest,
): Promise<Account> => {
  const response = await apiClient.post("/Account/create", data);
  return response.data;
};

export const updateAccountAsync = async (
  data: UpdateAccountRequest,
): Promise<Account> => {
  const response = await apiClient.post("/Account/update", data);
  return response.data;
};

export const deleteAccountAsync = async (
  data: DeleteAccountRequest,
): Promise<Account> => {
  const response = await apiClient.post("/Account/delete", data);
  return response.data;
};
