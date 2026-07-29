import { MachineStatus } from "../machine/MachineStatus";

export interface MachineKPI {
  name: string;
  code: string;
  type: string;
  brand: string;
  workingTime: number | null;
  maintenanceTime: number | null;
  machineStatus: MachineStatus;
}
