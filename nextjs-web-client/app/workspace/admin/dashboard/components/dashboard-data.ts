export type MachineStatus =
  | "AUTO"
  | "MANUAL"
  | "SETUP"
  | "STOP"
  | "ALARM"
  | "OFFLINE";

export type DashboardMachine = {
  id: number;
  code: string;
  name: string;
  type: string;
  status: MachineStatus;
  currentWorkOrder?: string;
  operator?: string;
  runtimeHours: number;
  utilization: number;
};

export type DelayedWorkOrder = {
  id: number;
  code: string;
  moldCode: string;
  partCode: string;
  machine: string;
  delayHours: number;
  dueDate: string;
};

export const dashboardMachines: DashboardMachine[] = [
  {
    id: 1,
    code: "MC-28",
    name: "AgieCharmilles Form 300",
    type: "EDM",
    status: "AUTO",
    currentWorkOrder: "WO-0001 / FX710-C2",
    operator: "Nguyen Van A",
    runtimeHours: 5.8,
    utilization: 82,
  },
  {
    id: 2,
    code: "MC-22",
    name: "Sodick AG40L",
    type: "EDM",
    status: "SETUP",
    currentWorkOrder: "WO-0003 / FX698-P1",
    operator: "Tran Van B",
    runtimeHours: 4.2,
    utilization: 66,
  },
  {
    id: 3,
    code: "MC-11",
    name: "Robodrill",
    type: "CNC",
    status: "STOP",
    runtimeHours: 2.6,
    utilization: 45,
  },
  {
    id: 4,
    code: "MC-08",
    name: "Vertical MC Center",
    type: "MILLING",
    status: "ALARM",
    currentWorkOrder: "WO-0004 / JIG-01",
    operator: "Le Van C",
    runtimeHours: 6.7,
    utilization: 91,
  },
  {
    id: 5,
    code: "MC-08",
    name: "Vertical MC Center",
    type: "MILLING",
    status: "ALARM",
    currentWorkOrder: "WO-0004 / JIG-01",
    operator: "Le Van C",
    runtimeHours: 6.7,
    utilization: 91,
  },
  {
    id: 6,
    code: "MC-08",
    name: "Vertical MC Center",
    type: "MILLING",
    status: "ALARM",
    currentWorkOrder: "WO-0004 / JIG-01",
    operator: "Le Van C",
    runtimeHours: 6.7,
    utilization: 91,
  },
  {
    id: 7,
    code: "MC-08",
    name: "Vertical MC Center",
    type: "MILLING",
    status: "ALARM",
    currentWorkOrder: "WO-0004 / JIG-01",
    operator: "Le Van C",
    runtimeHours: 6.7,
    utilization: 91,
  },
];

export const delayedWorkOrders: DelayedWorkOrder[] = [
  {
    id: 1,
    code: "WO-0003",
    moldCode: "FX698",
    partCode: "P1",
    machine: "Robodrill",
    delayHours: 9,
    dueDate: "2026-06-06",
  },
  {
    id: 2,
    code: "WO-0007",
    moldCode: "JIG-01",
    partCode: "BASE",
    machine: "Vertical MC Center",
    delayHours: 4,
    dueDate: "2026-06-07",
  },
];

export const todayPlan = [
  {
    time: "08:00",
    machine: "EDM AG40L",
    workOrder: "WO-0001",
    mold: "FX710-C2",
    status: "RUNNING",
  },
  {
    time: "10:00",
    machine: "FORM 300",
    workOrder: "WO-0002",
    mold: "FX730-F1",
    status: "WAITING",
  },
  {
    time: "13:00",
    machine: "ROBODRILL",
    workOrder: "WO-0003",
    mold: "FX698-P1",
    status: "DELAYED",
  },
];

export const utilizationByMachine = [
  { machine: "AG40L", utilization: 66 },
  { machine: "FORM300", utilization: 82 },
  { machine: "ROBO", utilization: 45 },
  { machine: "VMC", utilization: 91 },
];

export const operationTrend = [
  { time: "08:00", auto: 12, setup: 3, alarm: 0 },
  { time: "10:00", auto: 18, setup: 5, alarm: 1 },
  { time: "12:00", auto: 26, setup: 7, alarm: 1 },
  { time: "14:00", auto: 34, setup: 8, alarm: 3 },
  { time: "16:00", auto: 41, setup: 10, alarm: 4 },
];
