export type MachineKpi = {
  machine: string;
  type: string;
  utilization: number;
  autoRate: number;
  setupRate: number;
  alarmRate: number;
  planHours: number;
  actualHours: number;
  delayHours: number;
};

export const machineKpis: MachineKpi[] = [
  {
    machine: "EDM AG40L",
    type: "EDM",
    utilization: 78,
    autoRate: 64,
    setupRate: 18,
    alarmRate: 4,
    planHours: 160,
    actualHours: 149,
    delayHours: 6,
  },
  {
    machine: "FORM 300",
    type: "EDM",
    utilization: 69,
    autoRate: 58,
    setupRate: 22,
    alarmRate: 2,
    planHours: 150,
    actualHours: 132,
    delayHours: 9,
  },
  {
    machine: "ROBODRILL",
    type: "CNC",
    utilization: 82,
    autoRate: 71,
    setupRate: 14,
    alarmRate: 3,
    planHours: 170,
    actualHours: 165,
    delayHours: 4,
  },
  {
    machine: "VERTICAL MC",
    type: "MILLING",
    utilization: 88,
    autoRate: 76,
    setupRate: 12,
    alarmRate: 5,
    planHours: 180,
    actualHours: 172,
    delayHours: 11,
  },
];

export const dailyKpis = [
  { date: "06/01", auto: 42, manual: 12, setup: 9, alarm: 2 },
  { date: "06/02", auto: 48, manual: 10, setup: 8, alarm: 1 },
  { date: "06/03", auto: 45, manual: 14, setup: 7, alarm: 3 },
  { date: "06/04", auto: 51, manual: 11, setup: 6, alarm: 1 },
  { date: "06/05", auto: 55, manual: 9, setup: 7, alarm: 2 },
  { date: "06/06", auto: 49, manual: 13, setup: 10, alarm: 4 },
  { date: "06/07", auto: 53, manual: 10, setup: 8, alarm: 2 },
];

export const projectDelayData = [
  { project: "FX710", delayHours: 6 },
  { project: "FX730", delayHours: 2 },
  { project: "FX698", delayHours: 9 },
  { project: "JIG-01", delayHours: 4 },
];