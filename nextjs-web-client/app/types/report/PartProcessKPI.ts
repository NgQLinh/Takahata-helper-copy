import { Dayjs } from "dayjs";
import { ProcessStatus } from "../common/ProcessStatus";

export interface PartProcessKPI {
  machineId: number;
  machineName?: string;
  machineCode?: string;
  indexId: number;
  indexCode?: string;
  partId: number;
  partCode: string;
  partProcessId: number;
  quantity: number;
  processedQuantity: number;
  workingTime?: number;
  setupTime?: number;
  waitingTime?: number;
  plantDate?: Dayjs;
  startTime?: Dayjs;
  endTime?: Dayjs;
  status: ProcessStatus;
  estimatedTime?: number;
}
