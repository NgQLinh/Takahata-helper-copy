import { Machine } from "../machine/Machine";

export type Account = {
  id: string;
  userName: string;
  fullName: string;
  role: string;
  password: string;
  machineIds: number[];
  machines?: Machine[];
  isDefaultAccount?: boolean;
};
