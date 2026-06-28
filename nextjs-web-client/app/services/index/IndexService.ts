import { Index, SearchPartResponse } from "@/app/types";
import { apiClient } from "../common/apiClient";
import { Part } from "ag-grid-community";

export const createPartAsync = async (request: unknown): Promise<Part[]> => {
  const response = await apiClient.post<Part[]>("/Part/create", request);
  return response.data;
};

export const searchPartAsync = async (
  page: number,
  pageSize: number,
): Promise<SearchPartResponse> => {
  const response = await apiClient.post<SearchPartResponse>(
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

export const getIndexesAsync = async (): Promise<Index[]> => {
  const response = await apiClient.post<Index[]>("/Index/query-indexes");
  return response.data;
};
