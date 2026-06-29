import { PartProcess } from "../part/PartProcess";
import { Machine } from "./Machine";

export interface MachineSchedule extends Machine {
  partProcesses: PartProcess[] | [];
}
