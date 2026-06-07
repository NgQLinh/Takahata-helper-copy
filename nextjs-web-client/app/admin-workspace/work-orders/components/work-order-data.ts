export type WorkOrderStatus =
  | "PLANNING"
  | "WAITING"
  | "RUNNING"
  | "PAUSED"
  | "DONE"
  | "DELAYED"
  | "CANCELLED";

export type WorkOrder = {
  id: number;
  code: string;
  moldCode: string;
  partCode: string;
  process: string;
  machine: string;
  planStart: string;
  planEnd: string;
  planHours: number;
  actualHours?: number;
  priority: number;
  status: WorkOrderStatus;
};

export const workOrders: WorkOrder[] = [
  {
    id: 1,
    code: "WO-0001",
    moldCode: "FX710",
    partCode: "C2",
    process: "EDM",
    machine: "Sodick AG40L",
    planStart: "2026-06-06",
    planEnd: "2026-06-07",
    planHours: 12,
    actualHours: 8.5,
    priority: 1,
    status: "RUNNING",
  },
  {
    id: 2,
    code: "WO-0002",
    moldCode: "FX730",
    partCode: "F1",
    process: "EDM",
    machine: "Form 300",
    planStart: "2026-06-07",
    planEnd: "2026-06-08",
    planHours: 8,
    priority: 2,
    status: "WAITING",
  },
  {
    id: 3,
    code: "WO-0003",
    moldCode: "FX698",
    partCode: "P1",
    process: "CNC",
    machine: "Robodrill",
    planStart: "2026-06-05",
    planEnd: "2026-06-06",
    planHours: 10,
    actualHours: 13,
    priority: 1,
    status: "DELAYED",
  },
  {
    id: 4,
    code: "WO-0004",
    moldCode: "JIG-01",
    partCode: "BASE",
    process: "MILLING",
    machine: "Vertical MC Center",
    planStart: "2026-06-04",
    planEnd: "2026-06-05",
    planHours: 6,
    actualHours: 6,
    priority: 3,
    status: "DONE",
  },
];
