export interface PartProcess {
  partId: number;
  sequence: number;
  machineId: number;
  planDate: string;
  actualDate?: string | null;
  workingHours?: number | null;
  isCompleted: boolean;
  note?: string | null;
}
