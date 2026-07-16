import { ProcessStatus } from "../common/ProcessStatus";
import { PartStatus } from "./PartStatus";

export interface ManufacturingProcess {
  id: number;
  createAt: string;
  createBy: string;
  updateAt?: string | null;
  updateBy?: string | null;
  indexId: number;
  indexCode: string;
  partId: number;
  partCode: string;
  quantity: number;
  processedQuantity: number;
  status: ProcessStatus;
  note: string;
  partStatus: PartStatus;
}
