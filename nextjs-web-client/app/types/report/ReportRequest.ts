export interface ReportRequest {
  from: string;
  to: string;
}

export interface PartProcessReportRequest extends ReportRequest {
  searchMachineKeyword?: string;
  searchIndexKeyword?: string;
  searchPartKeyword?: string;
}
