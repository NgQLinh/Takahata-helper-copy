import { Dayjs } from "dayjs";
import { MachineStatus } from "./MachineStatus";

export interface Machine {
  id: number;
  sequenceNumber: number;
  name: string;
  type: string;
  code: string;
  brand: string;
  createAt: Dayjs;
  createBy: string;
  updateAt?: Dayjs | null;
  updateBy?: string;
  status: MachineStatus;
  bitAddress: number;
}
