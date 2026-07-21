import {} from "@/app/types";

import { apiClient } from "../common/apiClient";

export const getSettingsAsync = async (): Promise<boolean> => {
  const response = await apiClient.post<boolean>("/Settings/query");
  return response.data;
};

export const updateSettingsAsync = async (
  request: unknown,
): Promise<boolean> => {
  const response = await apiClient.post<boolean>("/Settings/update", request);
  return response.data;
};
