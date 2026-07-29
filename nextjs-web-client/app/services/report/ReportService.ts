import { MachineReport } from "@/app/types";
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
