import { MachineReport, PartProcessReport } from "@/app/types";
import { apiClient } from "../common/apiClient";

export const searchMachinesReportAsync = async (
  request: unknown,
): Promise<MachineReport> => {
  const response = await apiClient.post<MachineReport>(
    "/Report/machines-report-query",
    request,
  );
  return response.data;
};

export const searchPartProcessReportAsync = async (
  request: unknown,
): Promise<PartProcessReport> => {
  const response = await apiClient.post<PartProcessReport>(
    "/Report/part-process-report-query",
    request,
  );
  return response.data;
};
