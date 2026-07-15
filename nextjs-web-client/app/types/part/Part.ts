import { Index } from "./Index";
import { PartProcess } from "./PartProcess";
import { PartStatus } from "./PartStatus";

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
  processedQuantity: number;
  status: PartStatus;
}
