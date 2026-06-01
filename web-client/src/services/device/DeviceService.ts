import { CreateDeviceRequest, Device } from "../../types";
import { apiClient } from "../common/apiClient";

export const getDevicesAsync = async (): Promise<Device[]> => {
  const response = await apiClient.post<Device[]>("/Device/devices");
  return response.data;
};

export const createDeviceAsync = async (request : CreateDeviceRequest): Promise<Device> => {
  const response = await apiClient.post<Device>("/Device/create", request);
  return response.data;
};
