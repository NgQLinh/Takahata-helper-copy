"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import {
  getLatestMachineLogsAsync,
  getMachinesAsync,
} from "@/app/services/machine/MachineService";
import { MachineLog } from "@/app/types/machine/MachineLog";
import { MachineStatus } from "@/app/types/machine/MachineStatus";
import { Machine } from "@/app/types";

const statusConfig: Record<
  number,
  {
    text: string;
    badge: string;
    border: string;
  }
> = {
  [MachineStatus.None]: {
    text: "NONE",
    badge: "bg-dark",
    border: "border-dark",
  },

  [MachineStatus.Running]: {
    text: "RUNNING",
    badge: "bg-success",
    border: "border-success",
  },

  [MachineStatus.Paused]: {
    text: "PAUSED",
    badge: "bg-warning text-dark",
    border: "border-warning",
  },

  [MachineStatus.Stopped]: {
    text: "STOPPED",
    badge: "bg-secondary",
    border: "border-secondary",
  },

  [MachineStatus.Alarm]: {
    text: "ALARM",
    badge: "bg-danger",
    border: "border-danger",
  },

  [MachineStatus.Maintenance]: {
    text: "MAINTENANCE",
    badge: "bg-info text-dark",
    border: "border-info",
  },
};

export function DashboardPage() {
  const [now, setNow] = useState(dayjs());
  const [machineLogs, setMachineLogs] = useState<MachineLog[]>([]);
  const [machines, setMachines] = useState<Machine[] | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        if (!machines) {
          const ms = await getMachinesAsync();
          if (ms) {
            setMachines(ms);
          }
        } else {
          const machineIds = machines.map((machine) => machine.id);
          const data = await getLatestMachineLogsAsync({
            machineIds: machineIds,
          });
          setMachineLogs(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, [machines]);

  const summary = useMemo(
    () => ({
      running: machineLogs.filter((x) => x.status === MachineStatus.Running)
        .length,
      paused: machineLogs.filter((x) => x.status === MachineStatus.Paused)
        .length,
      stopped: machineLogs.filter((x) => x.status === MachineStatus.Stopped)
        .length,
      alarm: machineLogs.filter((x) => x.status === MachineStatus.Alarm).length,
      maintenance: machineLogs.filter(
        (x) => x.status === MachineStatus.Maintenance,
      ).length,
      total: machineLogs.length,
    }),
    [machineLogs],
  );

  return (
    <div
      className="container-fluid py-3 d-flex flex-column"
      style={{ height: "calc(100vh - 20px)" }}
    >
      {/* Summary */}
      <div className="row g-3 mb-3 shrink-0">
        <SummaryCard label="Running" value={summary.running} color="success" />
        <SummaryCard label="Paused" value={summary.paused} color="warning" />
        <SummaryCard
          label="Stopped"
          value={summary.stopped}
          color="secondary"
        />
        <SummaryCard label="Alarm" value={summary.alarm} color="danger" />
        <SummaryCard
          label="Maintenance"
          value={summary.maintenance}
          color="info"
        />
        <SummaryCard label="Total" value={summary.total} color="dark" />
      </div>

      {/* Danh sách máy */}
      <div className="card grow d-flex flex-column overflow-hidden">
        <div className="card-header d-flex justify-content-between align-items-center shrink-0">
          <strong>Trạng thái realtime</strong>
          <span>{now.format("DD/MM/YYYY HH:mm:ss")}</span>
        </div>

        <div className="card-body overflow-hidden">
          <div className="overflow-auto h-100">
            <div className="row g-3">
              {machineLogs.map((log) => (
                <div
                  key={`${log.machineId}-${String(log.time)}`}
                  className="col-lg-3 col-md-6"
                >
                  <MachineCard machineLog={log} />
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
  const cfg = statusConfig[machineLog.status];

  return (
    <div className={`card h-100 border-start border-4 ${cfg?.border ?? ""}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div>
            <div className="fw-bold">{machineLog.machine?.name}</div>
            <div className="text-muted small">{machineLog.machine?.code}</div>
            <div className="text-muted small">{machineLog.machine?.type}</div>
          </div>

          <span className={`badge ${cfg?.badge ?? "bg-dark"}`}>
            {cfg?.text ?? machineLog.status}
          </span>
        </div>

        <hr />

        <table className="table table-sm mb-0">
          <tbody>
            <tr>
              <td>Part</td>
              <td className="text-end">{machineLog.part?.code ?? "-"}</td>
            </tr>
            <tr>
              <td>Tên</td>
              <td className="text-end">{machineLog.part?.code ?? "-"}</td>
            </tr>
            <tr>
              <td>Cập nhật</td>
              <td className="text-end">
                {dayjs(machineLog.time).format("HH:mm:ss")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color = "dark",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="col">
      <div className={`card border-${color} h-100`}>
        <div className="card-body text-center">
          <div className={`text-${color} fw-semibold`}>{label}</div>
          <h2 className={`text-${color} mb-0`}>{value}</h2>
        </div>
      </div>
    </div>
  );
}
