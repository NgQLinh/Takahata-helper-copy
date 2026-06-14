"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DashboardMachine,
  MachineStatus,
  dashboardMachines,
  delayedWorkOrders,
  operationTrend,
  todayPlan,
  utilizationByMachine,
} from "./dashboard-data";

const statusClass: Record<MachineStatus, string> = {
  AUTO: "bg-green-100 text-green-700",
  MANUAL: "bg-blue-100 text-blue-700",
  SETUP: "bg-yellow-100 text-yellow-700",
  STOP: "bg-gray-100 text-gray-700",
  ALARM: "bg-red-100 text-red-700",
  OFFLINE: "bg-zinc-200 text-zinc-600",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(date));
}

export function DashboardPage() {
  const runningMachines = dashboardMachines.filter(
    (x) => x.status === "AUTO" || x.status === "MANUAL",
  ).length;

  const setupMachines = dashboardMachines.filter(
    (x) => x.status === "SETUP",
  ).length;

  const alarmMachines = dashboardMachines.filter(
    (x) => x.status === "ALARM",
  ).length;

  const stopMachines = dashboardMachines.filter(
    (x) => x.status === "STOP" || x.status === "OFFLINE",
  ).length;

  const avgUtilization = Math.round(
    dashboardMachines.reduce((sum, x) => sum + x.utilization, 0) /
      dashboardMachines.length,
  );

  const totalRuntime = dashboardMachines
    .reduce((sum, x) => sum + x.runtimeHours, 0)
    .toFixed(1);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tổng quan trạng thái máy, kế hoạch hôm nay, cảnh báo trễ và KPI vận
            hành
          </h1>
        </div>

        <div className="rounded-lg border bg-white px-4 py-2 text-sm text-gray-600">
          Today · 07/06/2026
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">
        <SummaryCard label="Running" value={runningMachines} />
        <SummaryCard label="Setup" value={setupMachines} />
        <SummaryCard label="Alarm" value={alarmMachines} danger />
        <SummaryCard label="Stop" value={stopMachines} />
        <SummaryCard label="Utilization" value={`${avgUtilization}%`} />
        <SummaryCard label="Runtime" value={`${totalRuntime}h`} />
      </div>

      <div className="grid gap-5">
        <div className="rounded-xl border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                Trạng thái realtime của từng máy.
              </h2>
            </div>

            <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100">
              View All
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {dashboardMachines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MachineCard({ machine }: { machine: DashboardMachine }) {
  return (
    <div className="rounded-xl border bg-gray-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-gray-500">{machine.code}</div>
          <div className="font-semibold text-gray-900">{machine.name}</div>
          <div className="text-sm text-gray-500">{machine.type}</div>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            statusClass[machine.status]
          }`}
        >
          {machine.status}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <InfoRow
          label="Work Order"
          value={machine.currentWorkOrder ?? "No active WO"}
        />
        <InfoRow label="Operator" value={machine.operator ?? "-"} />
        <InfoRow label="Runtime" value={`${machine.runtimeHours}h`} />
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-gray-500">Utilization</span>
          <span className="font-medium">{machine.utilization}%</span>
        </div>

        <div className="h-2 rounded-full bg-white">
          <div
            className="h-2 rounded-full bg-gray-900"
            style={{ width: `${machine.utilization}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  danger,
}: {
  label: string;
  value: string | number;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div
        className={`mt-1 text-2xl font-bold ${
          danger ? "text-red-600" : "text-gray-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <h2 className="mb-4 font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-900">{value}</span>
    </div>
  );
}
