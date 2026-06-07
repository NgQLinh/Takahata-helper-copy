export type MachineStatus = "AUTO" | "SETUP" | "STOP" | "ALARM";

export type Machine = {
  id: number;
  code: string;
  name: string;
  type: string;
  status: MachineStatus;
};

export type ScheduleItem = {
  id: number;
  machineId: number;
  date: string;
  moldCode: string;
  partCode: string;
  process: string;
  planHours: number;
  status: "PLANNED" | "RUNNING" | "DONE" | "DELAYED";
};

export const machines: Machine[] = [
  {
    id: 1,
    code: "MC-28",
    name: "AgieCharmilles Form 300",
    type: "EDM",
    status: "AUTO",
  },
  {
    id: 2,
    code: "MC-22",
    name: "Sodick AG40L",
    type: "EDM",
    status: "SETUP",
  },
  {
    id: 3,
    code: "MC-11",
    name: "Robodrill",
    type: "CNC",
    status: "STOP",
  },
  {
    id: 4,
    code: "MC-08",
    name: "Vertical MC Center",
    type: "MILLING",
    status: "ALARM",
  },
];

export const scheduleItems: ScheduleItem[] = [
  {
    id: 1,
    machineId: 1,
    date: "2026-06-06",
    moldCode: "FX710",
    partCode: "C2",
    process: "EDM",
    planHours: 12,
    status: "RUNNING",
  },
  {
    id: 2,
    machineId: 1,
    date: "2026-06-07",
    moldCode: "FX730",
    partCode: "F1",
    process: "EDM",
    planHours: 8,
    status: "PLANNED",
  },
  {
    id: 3,
    machineId: 2,
    date: "2026-06-06",
    moldCode: "FX698",
    partCode: "P1",
    process: "EDM",
    planHours: 10,
    status: "DELAYED",
  },
  {
    id: 4,
    machineId: 3,
    date: "2026-06-08",
    moldCode: "JIG-01",
    partCode: "BASE",
    process: "CNC",
    planHours: 6,
    status: "DONE",
  },
];
