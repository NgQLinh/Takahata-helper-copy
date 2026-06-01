import {
  CreateDeviceRequest,
  DeleteDeviceRequest,
  Device,
  UpdateDeviceRequest,
} from "../../types";
import { apiClient } from "../common/apiClient";

export const getDevicesAsync = async (): Promise<Device[]> => {
  const response = await apiClient.post<Device[]>("/Device/devices");
  return response.data;
};

export const createDeviceAsync = async (
  request: CreateDeviceRequest,
): Promise<Device> => {
  const response = await apiClient.post<Device>("/Device/create", request);
  return response.data;
};

export const deleteDeviceAsync = async (
  request: DeleteDeviceRequest,
): Promise<Device> => {
  const response = await apiClient.post<Device>("/Device/delete", request);
  return response.data;
};

export const updateDeviceAsync = async (
  request: UpdateDeviceRequest,
): Promise<Device> => {
  const response = await apiClient.post<Device>("/Device/update", request);
  return response.data;
};
