import { ProcessStatus } from "../common/ProcessStatus";
import { Machine } from "./Machine";

export interface MachineMaintenanceProcess {
  id: number;
  machineId: number;
  maintenanceType: string;
  description?: string | null;
  planDate: string;
  actualDate?: string | null;
  workingHours?: number | null;
  status: ProcessStatus;
  performedBy?: string | null;
  note?: string | null;
  machine: Machine | null;
  createAt: Date;
  createBy: string;
  updateAt?: string | Date;
  updateBy?: string;
}
