export type MoldProjectType =
  | "NEW_MOLD"
  | "REPAIR"
  | "ECO"
  | "JIG"
  | "URGENT"
  | "OVERSHOT";

export type MoldProjectStatus =
  | "PLANNING"
  | "WAITING"
  | "RUNNING"
  | "PAUSED"
  | "DONE"
  | "DELAYED"
  | "CANCELLED";

export type MoldProject = {
  id: number;
  moldCode: string;
  projectType: MoldProjectType;
  customer?: string;
  description?: string;
  startDate: string;
  dueDate: string;
  completedDate?: string;
  progress: number;
  totalParts: number;
  doneParts: number;
  totalWorkOrders: number;
  delayedWorkOrders: number;
  totalPlanHours: number;
  totalActualHours: number;
  estimatedCost: number;
  actualCost: number;
  status: MoldProjectStatus;
};

export const moldProjects: MoldProject[] = [
  {
    id: 1,
    moldCode: "FX710",
    projectType: "REPAIR",
    customer: "Takahata",
    description: "Repair ASSY, C2, F1, P1",
    startDate: "2026-06-01",
    dueDate: "2026-06-12",
    progress: 72,
    totalParts: 4,
    doneParts: 2,
    totalWorkOrders: 12,
    delayedWorkOrders: 1,
    totalPlanHours: 86,
    totalActualHours: 61,
    estimatedCost: 120000000,
    actualCost: 78000000,
    status: "RUNNING",
  },
  {
    id: 2,
    moldCode: "FX730",
    projectType: "NEW_MOLD",
    customer: "Internal",
    description: "New mold manufacturing",
    startDate: "2026-06-03",
    dueDate: "2026-06-20",
    progress: 38,
    totalParts: 8,
    doneParts: 2,
    totalWorkOrders: 24,
    delayedWorkOrders: 0,
    totalPlanHours: 180,
    totalActualHours: 64,
    estimatedCost: 450000000,
    actualCost: 152000000,
    status: "RUNNING",
  },
  {
    id: 3,
    moldCode: "FX698",
    projectType: "ECO",
    customer: "Takahata",
    description: "Mold ECO change part P1",
    startDate: "2026-05-28",
    dueDate: "2026-06-06",
    completedDate: "2026-06-06",
    progress: 100,
    totalParts: 2,
    doneParts: 2,
    totalWorkOrders: 6,
    delayedWorkOrders: 0,
    totalPlanHours: 34,
    totalActualHours: 32,
    estimatedCost: 65000000,
    actualCost: 62000000,
    status: "DONE",
  },
  {
    id: 4,
    moldCode: "JIG-01",
    projectType: "JIG",
    customer: "Production",
    description: "New jig for assembly line",
    startDate: "2026-06-05",
    dueDate: "2026-06-10",
    progress: 45,
    totalParts: 3,
    doneParts: 1,
    totalWorkOrders: 8,
    delayedWorkOrders: 2,
    totalPlanHours: 40,
    totalActualHours: 21,
    estimatedCost: 30000000,
    actualCost: 19000000,
    status: "DELAYED",
  },
];