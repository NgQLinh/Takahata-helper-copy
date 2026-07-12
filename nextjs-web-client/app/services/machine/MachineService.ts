import {
  CreateMachineRequest,
  DeleteMachineRequest,
  Machine,
  MachineSchedule,
  SearchResponse,
  UpdateMachineRequest,
  MachineMaintenanceProcess,
} from "@/app/types";

import { apiClient } from "../common/apiClient";

export const searchMachinesAsync = async (
  request: unknown,
): Promise<SearchResponse<Machine[]>> => {
  const response = await apiClient.post<SearchResponse<Machine[]>>(
    "/Machine/search",
    request,
  );
  return response.data;
};

export const getMachinesAsync = async (): Promise<Machine[]> => {
  const response = await apiClient.post<Machine[]>("/Machine/query-machines");
  return response.data;
};

export const getMachineSchedulesAsync = async (): Promise<
  MachineSchedule[]
> => {
  const response = await apiClient.post<MachineSchedule[]>(
    "/Machine/query-machines-schedule",
    {},
  );
  return response.data;
};

export const createMachineAsync = async (
  request: CreateMachineRequest,
): Promise<Machine> => {
  const response = await apiClient.post<Machine>("/Machine/create", request);
  return response.data;
};

export const deleteMachineAsync = async (
  request: DeleteMachineRequest,
): Promise<Machine> => {
  const response = await apiClient.post<Machine>("/Machine/delete", request);
  return response.data;
};

export const updateMachineAsync = async (
  request: UpdateMachineRequest,
): Promise<Machine> => {
  const response = await apiClient.post<Machine>("/Machine/update", request);
  return response.data;
};

// Kế hoạch bảo trì
export const createMachineMaintenanceProcess = async (
  request: unknown,
): Promise<MachineMaintenanceProcess> => {
  const response = await apiClient.post<MachineMaintenanceProcess>(
    "/MachineMaintenanceProcess/create",
    request,
  );
  return response.data;
};

export const updateMachineMaintenanceProcess = async (
  request: unknown,
): Promise<MachineMaintenanceProcess> => {
  const response = await apiClient.post<MachineMaintenanceProcess>(
    "/MachineMaintenanceProcess/update",
    request,
  );
  return response.data;
};

export const searchMachineMaintenanceProcess = async (
  request: unknown,
): Promise<SearchResponse<MachineMaintenanceProcess[]>> => {
  const response = await apiClient.post<
    SearchResponse<MachineMaintenanceProcess[]>
  >("/MachineMaintenanceProcess/search", request);

  return response.data;
};

export const deleteMachineMaintenanceProcessAsync = async (
  request: unknown,
): Promise<MachineMaintenanceProcess> => {
  const response = await apiClient.post<MachineMaintenanceProcess>(
    "/MachineMaintenanceProcess/delete",
    request,
  );
  return response.data;
};

export const getMachineMaintenanceProcessAsync = async (
  request: unknown,
): Promise<MachineMaintenanceProcess> => {
  const response = await apiClient.post<MachineMaintenanceProcess>(
    "/MachineMaintenanceProcess/detail",
    request,
  );
  return response.data;
};
