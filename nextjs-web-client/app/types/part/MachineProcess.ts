import { MachineProcessType } from "../common/MachineProcessType";
import { ProcessStatus } from "../common/ProcessStatus";

export interface MachineProcess {
  id: number;
  createAt: string;
  createBy: string;
  updateAt?: string | null;
  updateBy?: string | null;
  partId: number;
  partCode: string;
  quantity: number;
  status: ProcessStatus;
  note: string;
  plantDate: string;
  actualDate?: string | null;
  workingTime?: number | null;
  sequence: number;
  type: MachineProcessType;
}
