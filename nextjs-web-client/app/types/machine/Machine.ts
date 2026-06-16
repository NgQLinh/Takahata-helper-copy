import { MachineStatus } from "./MachineStatus";

export interface Machine {
  id: number;
  sequenceNumber: number;
  name: string;
  type: string;
  code: string;
  brand: string;
  createAt: Date;
  createBy: string;
  updateAt?: string | Date;
  updateBy?: string;
  status: MachineStatus;
  bitAddress: number;
}
