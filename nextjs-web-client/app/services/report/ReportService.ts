import { MachineReport, PartProcessReport, ReportRequest } from "@/app/types";
import { apiClient } from "../common/apiClient";
import { PartProcessReportRequest } from "@/app/types/report/ReportRequest";

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

export const downloadMachinesReportAsync = async (
  request: ReportRequest,
): Promise<void> => {
  const response = await apiClient.post<Blob>(
    "/Report/machines/export",
    request,
    {
      responseType: "blob",
    },
  );

  downloadFileFromResponse(
    response.data,
    response.headers["content-disposition"],
    `machine-kpi-${request.from}-${request.to}.xlsx`,
  );
};

export const downloadPartProcessReportAsync = async (
  request: PartProcessReportRequest,
): Promise<void> => {
  const response = await apiClient.post<Blob>(
    "/Report/part-processes/export",
    request,
    {
      responseType: "blob",
    },
  );

  downloadFileFromResponse(
    response.data,
    response.headers["content-disposition"],
    `part-process-kpi-${request.from}-${request.to}.xlsx`,
  );
};

const downloadFileFromResponse = (
  data: Blob,
  contentDisposition: string | undefined,
  fallbackFileName: string,
): void => {
  const fileName =
    getFileNameFromContentDisposition(contentDisposition) ?? fallbackFileName;

  const blob = new Blob([data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.URL.revokeObjectURL(url);
};

const getFileNameFromContentDisposition = (
  contentDisposition?: string,
): string | null => {
  if (!contentDisposition) {
    return null;
  }

  // Ví dụ:
  // filename*=UTF-8''machine-kpi.xlsx
  const encodedFileNameMatch = contentDisposition.match(
    /filename\*=UTF-8''([^;]+)/i,
  );

  if (encodedFileNameMatch?.[1]) {
    return decodeURIComponent(encodedFileNameMatch[1]);
  }

  // Ví dụ:
  // filename="machine-kpi.xlsx"
  const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);

  return fileNameMatch?.[1] ?? null;
};
