import { Dayjs } from "dayjs";
import { MachineStatus } from "./MachineStatus";

export interface Machine {
  id: number;
  name: string;
  code: string;
  type: string;
  brand: string;
  isAutomatic: boolean;
  createAt: Dayjs;
  createBy: string;
  updateAt?: Dayjs | null;
  updateBy?: string;
  machineStatus: MachineStatus;
  machineStatusChangeAt: Dayjs | null;

  partId: number;
  partProcessId: number;

  statusBitAddress: number | null;
  processStatusBitAddress: number | null;
  partBitAddress: number | null;
  partProcessBitAddress: number | null;

  hasScheduledMaintenance: boolean | null;
}
