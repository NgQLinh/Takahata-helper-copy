import { MachineProcess } from "../part/MachineProcess";
import { Machine } from "./Machine";

export interface MachineSchedule extends Machine {
  processes: MachineProcess[] | [];
}
