export type CostCategory =
  | "MATERIAL"
  | "MACHINE"
  | "LABOR"
  | "OUTSOURCE"
  | "REPAIR"
  | "MODIFY"
  | "TRY_OUT";

export type ProjectCost = {
  id: number;
  moldCode: string;
  partCode?: string;
  workOrderCode?: string;
  category: CostCategory;
  costAmount: number;
  costDate: string;
  note?: string;
};

export const projectCosts: ProjectCost[] = [
  {
    id: 1,
    moldCode: "FX710",
    partCode: "C2",
    workOrderCode: "WO-0001",
    category: "REPAIR",
    costAmount: 18000000,
    costDate: "2026-06-06",
    note: "Repair cavity C2",
  },
  {
    id: 2,
    moldCode: "FX710",
    partCode: "F1",
    workOrderCode: "WO-0002",
    category: "MACHINE",
    costAmount: 12500000,
    costDate: "2026-06-07",
    note: "EDM machining cost",
  },
  {
    id: 3,
    moldCode: "FX730",
    partCode: "ASSY",
    category: "MATERIAL",
    costAmount: 86000000,
    costDate: "2026-06-08",
    note: "Steel material",
  },
  {
    id: 4,
    moldCode: "JIG-01",
    category: "LABOR",
    costAmount: 6500000,
    costDate: "2026-06-09",
    note: "Assembly labor",
  },
];