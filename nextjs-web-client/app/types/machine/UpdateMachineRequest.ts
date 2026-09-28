export interface UpdateMachineRequest {
  id: number;
  name: string;
  type: string;
  code: string;
  brand: string;
  isAutomatic: boolean;
  statusBitAddress: number | null;
  processStatusBitAddress: number | null;
  partBitAddress: number | null;
  partProcessBitAddress: number | null;
}
