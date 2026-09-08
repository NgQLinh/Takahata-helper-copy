export type UpdateAccountRequest = {
  id: string;
  userName: string;
  fullName: string;
  password: string;
  role: string;
  machineIds: number[];
};
