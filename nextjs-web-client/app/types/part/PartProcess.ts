import { ProcessStatus } from "../common/ProcessStatus";
import { Machine } from "../machine/Machine";

export interface PartProcess {
  id: number;
  partId: number;
  sequence: number;
  machineId: number;
  plantDate: string;
  actualDate?: string | null;
  workingHours?: number | null;
  status: ProcessStatus;
  note?: string | null;
  machine: Machine | null;
  quantity: number;
  processedQuantity: number;
}
