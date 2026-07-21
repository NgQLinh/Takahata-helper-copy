export interface CreateMachineRequest {
  name: string;
  type: string;
  code: string;
  brand: string;
  statusBitAddress: number | null;
  partBitAddress: number | null;
  partProcessBitAddress: number | null;
}
