import { Machine } from "../machine/Machine";

export interface PartProcess {
  id: number;
  partId: number;
  sequence: number;
  machineId: number;
  planDate: string;
  actualDate?: string | null;
  workingHours?: number | null;
  isCompleted: boolean;
  note?: string | null;
  machine: Machine | null;
}
