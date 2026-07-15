"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dailyKpis, machineKpis, projectDelayData } from "./kpi-data";

const dateRanges = ["Today", "This Week", "This Month", "Custom"];
const machineTypes = ["ALL", "EDM", "CNC", "MILLING"];

export function KpiReportsPage() {
  const [dateRange, setDateRange] = useState("This Week");
  const [machineType, setMachineType] = useState("ALL");

  const filteredMachines = useMemo(() => {
    if (machineType === "ALL") return machineKpis;
    return machineKpis.filter((x) => x.type === machineType);
  }, [machineType]);

  const avgUtilization = Math.round(
    filteredMachines.reduce((sum, x) => sum + x.utilization, 0) /
      filteredMachines.length,
  );

  const avgAutoRate = Math.round(
    filteredMachines.reduce((sum, x) => sum + x.autoRate, 0) /
      filteredMachines.length,
  );

  const totalPlanHours = filteredMachines.reduce(
    (sum, x) => sum + x.planHours,
    0,
  );

  const totalActualHours = filteredMachines.reduce(
    (sum, x) => sum + x.actualHours,
    0,
  );

  const totalDelayHours = filteredMachines.reduce(
    (sum, x) => sum + x.delayHours,
    0,
  );

  const operationPieData = [
    {
      name: "Auto",
      value: dailyKpis.reduce((sum, x) => sum + x.auto, 0),
    },
    {
      name: "Manual",
      value: dailyKpis.reduce((sum, x) => sum + x.manual, 0),
    },
    {
      name: "Setup",
      value: dailyKpis.reduce((sum, x) => sum + x.setup, 0),
    },
    {
      name: "Alarm",
      value: dailyKpis.reduce((sum, x) => sum + x.alarm, 0),
    },
  ];

  return (
    <div>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Báo cáo hiệu suất máy, thời gian auto/setup/alarm, plan vs actual
              và delay
            </h1>
          </div>

          <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100">
            Export Report
          </button>
        </div>

        <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-10 rounded-lg border px-3 text-sm outline-none focus:border-gray-400"
          >
            {dateRanges.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={machineType}
            onChange={(e) => setMachineType(e.target.value)}
            className="h-10 rounded-lg border px-3 text-sm outline-none focus:border-gray-400"
          >
            {machineTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <SummaryCard label="Utilization" value={`${avgUtilization}%`} />
          <SummaryCard label="Auto Rate" value={`${avgAutoRate}%`} />
          <SummaryCard label="Plan Hours" value={`${totalPlanHours}h`} />
          <SummaryCard label="Actual Hours" value={`${totalActualHours}h`} />
          <SummaryCard
            label="Delay Hours"
            value={`${totalDelayHours}h`}
            danger
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <ChartCard title="Machine Utilization %">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredMachines}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="machine" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="utilization" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Auto / Manual / Setup / Alarm by Day">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyKpis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="auto" />
                <Line type="monotone" dataKey="manual" />
                <Line type="monotone" dataKey="setup" />
                <Line type="monotone" dataKey="alarm" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Plan Hours vs Actual Hours">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredMachines}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="machine" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="planHours" />
                <Bar dataKey="actualHours" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Operation Time Ratio">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={operationPieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {operationPieData.map((_, index) => (
                    <Cell key={index} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
          <div className="rounded-xl border bg-white">
            <div className="border-b p-5">
              <h2 className="font-semibold text-gray-900">
                Machine KPI Detail
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Machine</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Utilization</th>
                    <th className="px-4 py-3">Auto Rate</th>
                    <th className="px-4 py-3">Setup Rate</th>
                    <th className="px-4 py-3">Alarm Rate</th>
                    <th className="px-4 py-3">Plan / Actual</th>
                    <th className="px-4 py-3">Delay</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredMachines.map((item) => (
                    <tr key={item.machine} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {item.machine}
                      </td>
                      <td className="px-4 py-3">{item.type}</td>
                      <td className="px-4 py-3">{item.utilization}%</td>
                      <td className="px-4 py-3">{item.autoRate}%</td>
                      <td className="px-4 py-3">{item.setupRate}%</td>
                      <td className="px-4 py-3">{item.alarmRate}%</td>
                      <td className="px-4 py-3">
                        {item.planHours}/{item.actualHours}h
                      </td>
                      <td className="px-4 py-3 text-red-600">
                        {item.delayHours}h
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <ChartCard title="Delay by Project">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={projectDelayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="project" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="delayHours" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
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
