import { Account } from "@/app/types/account/Account";
import { apiClient } from "@/app/services/common/apiClient";
import {
  CreateAccountRequest,
  DeleteAccountRequest,
  UpdateAccountRequest,
} from "@/app/types";

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
