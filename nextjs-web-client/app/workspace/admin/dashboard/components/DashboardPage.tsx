"use client";

import { useCallback, useEffect, useState } from "react";
import { dashboardMachines } from "./dashboard-data";
import dayjs, { Dayjs } from "dayjs";
import { Machine } from "@/app/types";
import {
  getLatestMachineLogsAsync,
  getMachinesAsync,
} from "@/app/services/machine/MachineService";
import { toast } from "react-toastify";
import { MachineLog } from "@/app/types/machine/MachineLog";

export function DashboardPage() {
  const [today, setToday] = useState<Dayjs | undefined>(dayjs());
  const [machineLogs, setMachineLogs] = useState<MachineLog[]>([]);
  const [loadingMachine, setLoadingMachine] = useState(false);

  useEffect(() => {
    const loadMachines = async () => {
      try {
        const data = await getLatestMachineLogsAsync();
        setMachineLogs(data);
      } catch (err) {
        console.error(err);
      }
    };

    // Load ngay lần đầu
    loadMachines();

    // Sau đó 5s cập nhật một lần
    const interval = setInterval(loadMachines, 5000);

    return () => clearInterval(interval);
  }, []);

  // const fetchMachines = useCallback(async () => {
  //   setLoadingMachine(true);

  //   try {
  //     const data = await getMachinesAsync();
  //     setMachines(data);
  //     console.log(data);
  //   } catch (error) {
  //     console.error("Lỗi khi lấy danh sách máy:", error);
  //     toast.error("Không thể tải danh sách máy.");
  //   } finally {
  //     setLoadingMachine(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   const run = async () => {
  //     await Promise.all([fetchMachines()]);
  //   };

  //   if (!open) return;

  //   void run();
  // }, [fetchMachines]);

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
    <div className="d-flex flex-column h-100">
      {/* Summary */}
      <div className="row g-3 shrink-0 mb-3">
        <div className="col-6 col-xl">
          <SummaryCard label="Running" value={runningMachines} />
        </div>
        <div className="col-6 col-xl">
          <SummaryCard label="Setup" value={setupMachines} />
        </div>
        <div className="col-6 col-xl">
          <SummaryCard label="Alarm" value={alarmMachines} danger />
        </div>
        <div className="col-6 col-xl">
          <SummaryCard label="Stop" value={stopMachines} />
        </div>
        <div className="col-6 col-xl">
          <SummaryCard label="Utilization" value={`${avgUtilization}%`} />
        </div>
        <div className="col-6 col-xl">
          <SummaryCard label="Runtime" value={`${totalRuntime}h`} />
        </div>
      </div>

      {/* Panel */}
      <div className="card grow d-flex flex-column overflow-hidden">
        <div className="card-body d-flex flex-column overflow-hidden">
          <div className="d-flex justify-content-between align-items-center mb-3 shrink-0">
            <h5 className="mb-0">Trạng thái realtime của từng máy</h5>

            <div className="d-flex gap-2">
              <div className="border rounded px-3 py-2 text-muted small">
                Today · {dayjs(today).format("DD/MM/YYYY HH:mm")}
              </div>

              <button className="btn btn-outline-secondary btn-sm">
                View All
              </button>
            </div>
          </div>

          {/* Danh sách máy */}
          <div
            className="overflow-auto"
            style={{ height: "calc(100vh - 240px)" }}
          >
            <div className="row g-3">
              {machineLogs.map((machineLog) => (
                <div
                  key={machineLog.time.toString()}
                  className="col-12 col-md-6 col-xl-3"
                >
                  <MachineCard machineLog={machineLog} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MachineCard({ machineLog }: { machineLog: MachineLog }) {
  return (
    <div className="rounded-xl border bg-gray-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-gray-500">{machineLog.machine.code}</div>
          <div className="font-semibold text-gray-900">
            {machineLog.machine.name}
          </div>
          <div className="text-sm text-gray-500">{machineLog.machine.type}</div>
        </div>

        <span
        // className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        //   statusClass[machine.status]
        // }`}
        >
          {machineLog.status}
        </span>
      </div>

      {/* <div className="mt-4 space-y-2 text-sm">
        <InfoRow
          label="Work Order"
          value={machine.currentWorkOrder ?? "No active WO"}
        />
        <InfoRow label="Operator" value={machine.operator ?? "-"} />
        <InfoRow label="Runtime" value={`${machine.runtimeHours}h`} />
      </div> */}

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-gray-500">Utilization</span>
          {/* <span className="font-medium">{machine.utilization}%</span> */}
        </div>

        <div className="h-2 rounded-full bg-white">
          {/* <div
            className="h-2 rounded-full bg-gray-900"
            style={{ width: `${machine.utilization}%` }}
          /> */}
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
