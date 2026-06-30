import {
  CreateMachineRequest,
  DeleteMachineRequest,
  Machine,
  MachineSchedule,
  UpdateMachineRequest,
} from "@/app/types";

import { apiClient } from "../common/apiClient";

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
