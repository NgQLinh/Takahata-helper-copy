import { Index, SearchResponse } from "@/app/types";
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

export const deletePartAsync = async (id: number): Promise<Part> => {
  const response = await apiClient.post<Part>("/Part/delete", { id: id });
  return response.data;
};

export const closePartAsync = async (id: number): Promise<boolean> => {
  const response = await apiClient.post<boolean>("/Part/close", { id });
  return response.data;
};

export const approvePartAsync = async (request: unknown): Promise<Part[]> => {
  const response = await apiClient.post<Part[]>("/Part/approve", request);
  return response.data;
};

export const searchPartAsync = async (
  request: unknown,
): Promise<SearchResponse<Part[]>> => {
  const response = await apiClient.post<SearchResponse<Part[]>>(
    "/Part/query-parts",
    request,
  );

  return response.data;
};

export const getPartAsync = async (id: number): Promise<Part> => {
  const response = await apiClient.post<Part>("/Part/detail", { id: id });
  return response.data;
};

export const searchIndexesAsync = async (
  request: unknown,
): Promise<SearchResponse<Index[]>> => {
  const response = await apiClient.post<SearchResponse<Index[]>>(
    "/Index/search",
    request,
  );
  return response.data;
};

export const deleteIndexesAsync = async (
  request: unknown,
): Promise<SearchResponse<Index[]>> => {
  const response = await apiClient.post<SearchResponse<Index[]>>(
    "/Index/delete",
    request,
  );
  return response.data;
};

export const updateIndexAsync = async (
  request: unknown,
): Promise<SearchResponse<Index[]>> => {
  const response = await apiClient.post<SearchResponse<Index[]>>(
    "/Index/update",
    request,
  );
  return response.data;
};
