import { apiClient } from "../common/apiClient";
import { Part } from "ag-grid-community";

export const createPartAsync = async (request: unknown): Promise<Part[]> => {
  const response = await apiClient.post<Part[]>("/Part/create", request);
  return response.data;
};
