import { Index, MachineMaintenanceProcess, SearchResponse } from "@/app/types";
import { apiClient } from "../common/apiClient";
import { Part } from "@/app/types";

export const createPartAsync = async (request: unknown): Promise<Part[]> => {
  const response = await apiClient.post<Part[]>("/Part/create", request);
  return response.data;
};

export const updatePartAsync = async (request: unknown): Promise<Part[]> => {
  const response = await apiClient.post<Part[]>("/Part/update", request);
  return response.data;
};

export const searchPartAsync = async (
  page: number,
  pageSize: number,
): Promise<SearchResponse<Part[]>> => {
  const response = await apiClient.post<SearchResponse<Part[]>>(
    "/Part/query-parts",
    {
      page,
      pageSize,
    },
  );

  return response.data;
};

export const deletePartAsync = async (id: number): Promise<Part> => {
  const response = await apiClient.post<Part>("/Part/delete", { id: id });
  return response.data;
};

export const getPartAsync = async (id: number): Promise<Part> => {
  const response = await apiClient.post<Part>("/Part/detail", { id: id });
  return response.data;
};

export const getIndexesAsync = async (): Promise<Index[]> => {
  const response = await apiClient.post<Index[]>("/Index/query-indexes");
  return response.data;
};
