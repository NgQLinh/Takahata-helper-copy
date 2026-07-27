import { Dayjs } from "dayjs";
import { ProcessStatus } from "../common/ProcessStatus";
import { Machine } from "./Machine";

export interface MachineMaintenanceProcess {
  id: number;
  machineId: number;
  maintenanceType: string;
  description?: string | null;
  plantDate: Dayjs;
  actualDate?: Dayjs | null;
  workingTime?: number | null;
  status: ProcessStatus;
  performedBy?: string | null;
  note?: string | null;
  machine: Machine | null;
  createAt: Dayjs;
  createBy: string;
  updateAt?: Dayjs | null;
  updateBy?: string;
}
