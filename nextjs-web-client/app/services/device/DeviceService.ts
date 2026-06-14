import {
  CreateMachineRequest,
  DeleteMachineRequest,
  Machine,
  UpdateMachineRequest,
} from "@/app/types";

import { apiClient } from "../common/apiClient";

export const getDevicesAsync = async (): Promise<Machine[]> => {
  const response = await apiClient.post<Machine[]>("/Device/devices");
  return response.data;
};

export const createDeviceAsync = async (
  request: CreateMachineRequest,
): Promise<Machine> => {
  const response = await apiClient.post<Machine>("/Device/create", request);
  return response.data;
};

export const deleteDeviceAsync = async (
  request: DeleteMachineRequest,
): Promise<Machine> => {
  const response = await apiClient.post<Machine>("/Device/delete", request);
  return response.data;
};

export const updateDeviceAsync = async (
  request: UpdateMachineRequest,
): Promise<Machine> => {
  const response = await apiClient.post<Machine>("/Device/update", request);
  return response.data;
};
