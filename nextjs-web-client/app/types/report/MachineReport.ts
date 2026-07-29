import { MachineKPI } from "./MachineKPI";

export interface MachineReport {
  machineKPIs: MachineKPI[] | null;
}
