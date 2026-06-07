export type ImportType =
  | "MACHINE_SCHEDULE"
  | "WORK_ORDERS"
  | "MOLD_PROJECTS"
  | "MACHINE_OPERATION"
  | "COSTS";

export type ImportStatus =
  | "PENDING"
  | "VALIDATING"
  | "SUCCESS"
  | "FAILED"
  | "PARTIAL_SUCCESS";

export type PreviewRow = {
  row: number;
  moldCode: string;
  partCode: string;
  process: string;
  machine: string;
  planDate: string;
  planHours: number;
  status: "VALID" | "ERROR";
  message?: string;
};

export const previewRows: PreviewRow[] = [
  {
    row: 2,
    moldCode: "FX710",
    partCode: "C2",
    process: "EDM",
    machine: "Sodick AG40L",
    planDate: "2026-06-07",
    planHours: 12,
    status: "VALID",
  },
  {
    row: 3,
    moldCode: "FX730",
    partCode: "F1",
    process: "EDM",
    machine: "Form 300",
    planDate: "2026-06-08",
    planHours: 8,
    status: "VALID",
  },
  {
    row: 4,
    moldCode: "FX698",
    partCode: "P1",
    process: "CNC",
    machine: "",
    planDate: "2026-06-09",
    planHours: 10,
    status: "ERROR",
    message: "Machine is required",
  },
];

export const importHistory = [
  {
    id: 1,
    fileName: "Machine sch 2026.xlsx",
    type: "MACHINE_SCHEDULE",
    importedAt: "2026-06-07 08:30",
    totalRows: 128,
    successRows: 125,
    errorRows: 3,
    status: "PARTIAL_SUCCESS",
  },
  {
    id: 2,
    fileName: "MC OPERATION (MAY.2026).xlsx",
    type: "MACHINE_OPERATION",
    importedAt: "2026-06-06 17:20",
    totalRows: 90,
    successRows: 90,
    errorRows: 0,
    status: "SUCCESS",
  },
] as const;
