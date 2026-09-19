import { ProcessStatus } from "../common/ProcessStatus";
import { Index } from "./Index";
import { PartProcess } from "./PartProcess";
import { PartType } from "./PartType";

export interface Part {
  id: number;
  indexId: number;
  code: string;
  index: Index;
  processes: PartProcess[];
  createAt: string;
  createBy: string;
  updateAt?: string | null;
  updateBy?: string | null;
  quantity: number;
  status: ProcessStatus;
  prioritize: boolean;
  partType: PartType;
}
