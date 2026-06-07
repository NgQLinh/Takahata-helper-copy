export type Role = "ADMIN" | "MANAGER" | "PLANNER" | "OPERATOR" | "VIEWER";

export type UserSetting = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
};

export const users: UserSetting[] = [
  {
    id: 1,
    username: "admin",
    fullName: "System Admin",
    email: "admin@factory.local",
    role: "ADMIN",
    isActive: true,
  },
  {
    id: 2,
    username: "planner01",
    fullName: "Production Planner",
    email: "planner@factory.local",
    role: "PLANNER",
    isActive: true,
  },
  {
    id: 3,
    username: "operator01",
    fullName: "Machine Operator",
    email: "operator@factory.local",
    role: "OPERATOR",
    isActive: true,
  },
];

export const processTypes = [
  "DESIGN",
  "CAM",
  "CNC",
  "EDM",
  "WIRE_CUT",
  "GRINDING",
  "MEASURING",
  "ASSEMBLY",
  "TRY_OUT",
  "REPAIR",
];

export const costCategories = [
  "MATERIAL",
  "MACHINE",
  "LABOR",
  "OUTSOURCE",
  "REPAIR",
  "MODIFY",
  "TRY_OUT",
];