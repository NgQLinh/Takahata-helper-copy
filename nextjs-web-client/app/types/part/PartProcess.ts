import { Dayjs } from "dayjs";
import { ProcessStatus } from "../common/ProcessStatus";
import { Machine } from "../machine/Machine";

export interface PartProcess {
  id: number;
  partId: number;
  sequence: number;
  machineId: number;
  plantDate: string;
  startTime?: Dayjs | null;
  endTime?: Dayjs | null;
  workingTime: number | null;
  setupTime: number | null;
  waitingTime: number | null;
  status: ProcessStatus;
  note?: string | null;
  performedBy?: string | null;
  machine: Machine | null;
  quantity: number;
  processedQuantity: number;
  estimatedTime?: number | null;
}
