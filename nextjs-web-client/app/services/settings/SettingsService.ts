import { Setting } from "@/app/types";
import { apiClient } from "../common/apiClient";

export const getSettingsAsync = async (): Promise<Setting> => {
  const response = await apiClient.post<Setting>("/Settings/query");
  return response.data;
};

export const updateSettingsAsync = async (
  request: unknown,
): Promise<boolean> => {
  const response = await apiClient.post<boolean>("/Settings/update", request);
  return response.data;
};

export const testConnectionAsync = async (): Promise<boolean> => {
  const response = await apiClient.post<boolean>("/Settings/test-connection");
  return response.data;
};
