import { DeviceType } from "./DeviceType";
import { DeviceStatus } from "./DeviceStatus";

export interface Device {
  id: number;
  name: string;
  type: DeviceType;
  serialNumber: string;
  brand: string;
  createAt: string;
  createBy: string;
  updateAt?: string;
  updateBy?: string;
  status: DeviceStatus;
  bitAddress: number;
}
