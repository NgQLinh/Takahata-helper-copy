import { ManufacturingProcess } from "@/app/types";
import { apiClient } from "../common/apiClient";

export const startAsync = async (
  request: unknown,
): Promise<ManufacturingProcess> => {
  const response = await apiClient.post<ManufacturingProcess>(
    "/Manufacturing/start",
    request,
  );
  return response.data;
};

export const pauseAsync = async (
  request: unknown,
): Promise<ManufacturingProcess> => {
  const response = await apiClient.post<ManufacturingProcess>(
    "/Manufacturing/pause",
    request,
  );
  return response.data;
};

export const completeAsync = async (
  request: unknown,
): Promise<ManufacturingProcess> => {
  const response = await apiClient.post<ManufacturingProcess>(
    "/Manufacturing/complete",
    request,
  );
  return response.data;
};
