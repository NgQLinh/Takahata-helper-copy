import { MachineStatus } from "./MachineStatus";

export interface Machine {
  id: number;
  name: string;
  type: string;
  code: string;
  brand: string;
  createAt: string;
  createBy: string;
  updateAt?: string;
  updateBy?: string;
  status: MachineStatus;
  bitAddress: number;
}
