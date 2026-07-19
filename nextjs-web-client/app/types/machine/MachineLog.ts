import { Dayjs } from "dayjs";
import { MachineStatus } from "./MachineStatus";
import { Part } from "../part/Part";
import { Machine } from "./Machine";

export interface MachineLog {
  machineId: number;
  partId: number;
  status: MachineStatus;
  time: Dayjs;
  part: Part;
  machine: Machine;
}
