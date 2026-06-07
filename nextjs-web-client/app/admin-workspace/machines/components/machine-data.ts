export type MachineStatus =
  | "AUTO"
  | "MANUAL"
  | "SETUP"
  | "STOP"
  | "ALARM"
  | "OFFLINE";

export type Machine = {
  id: number;
  code: string;
  name: string;
  type: string;
  standardHoursPerDay: number;
  currentWorkOrder?: string;
  operator?: string;
  utilization: number;
  autoRate: number;
  status: MachineStatus;
  isActive: boolean;
};

export const machines: Machine[] = [
  {
    id: 1,
    code: "MC-28",
    name: "AgieCharmilles Form 300",
    type: "EDM",
    standardHoursPerDay: 7.5,
    currentWorkOrder: "WO-0001 / FX710-C2",
    operator: "Nguyen Van A",
    utilization: 82,
    autoRate: 74,
    status: "AUTO",
    isActive: true,
  },
  {
    id: 2,
    code: "MC-22",
    name: "Sodick AG40L",
    type: "EDM",
    standardHoursPerDay: 7.5,
    currentWorkOrder: "WO-0003 / FX698-P1",
    operator: "Tran Van B",
    utilization: 66,
    autoRate: 51,
    status: "SETUP",
    isActive: true,
  },
  {
    id: 3,
    code: "MC-11",
    name: "Robodrill",
    type: "CNC",
    standardHoursPerDay: 7.5,
    utilization: 45,
    autoRate: 38,
    status: "STOP",
    isActive: true,
  },
  {
    id: 4,
    code: "MC-08",
    name: "Vertical MC Center",
    type: "MILLING",
    standardHoursPerDay: 7.5,
    currentWorkOrder: "WO-0004 / JIG-01",
    operator: "Le Van C",
    utilization: 91,
    autoRate: 80,
    status: "ALARM",
    isActive: true,
  },
];
