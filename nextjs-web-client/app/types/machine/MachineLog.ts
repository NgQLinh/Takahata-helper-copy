import { Part } from "../part/Part";
import { Machine } from "./Machine";

export interface MachineLog extends  Machine {
  part: Part;
}
