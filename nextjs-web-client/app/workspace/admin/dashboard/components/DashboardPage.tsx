"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import { getLatestMachineLogsAsync } from "@/app/services/machine/MachineService";
import { MachineLog } from "@/app/types/machine/MachineLog";
import { MachineStatus } from "@/app/types/machine/MachineStatus";

const statusConfig: Record<
  number,
  {
    text: string;
    badge: string;
    border: string;
  }
> = {
  [MachineStatus.Active]: {
    text: "AUTO",
    badge: "bg-success",
    border: "border-success",
  },
  [MachineStatus.Inactive]: {
    text: "MANUAL",
    badge: "bg-primary",
    border: "border-primary",
  },
  [MachineStatus.Removed]: {
    text: "SETUP",
    badge: "bg-warning text-dark",
    border: "border-warning",
  },
  // [MachineStatus.Alarm]: { text: "ALARM", badge: "bg-danger", border: "border-danger" },
  [MachineStatus.Stop]: {
    text: "STOP",
    badge: "bg-secondary",
    border: "border-secondary",
  },
};

export function DashboardPage() {
  const [now, setNow] = useState(dayjs());
  const [machineLogs, setMachineLogs] = useState<MachineLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getLatestMachineLogsAsync();
        setMachineLogs(data);
      } catch {
        toast.error("Không thể tải trạng thái máy.");
      } finally {
        setLoading(false);
      }
    };

    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, []);

  const summary = useMemo(
    () => ({
      running: machineLogs.filter((x) => x.status === MachineStatus.Active)
        .length,
      setup: machineLogs.filter((x) => x.status === MachineStatus.Inactive)
        .length,
      alarm: machineLogs.filter((x) => x.status === MachineStatus.Removed)
        .length,
      stop: machineLogs.filter((x) => x.status === MachineStatus.Stop).length,
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
        <SummaryCard label="Running" value={summary.running} />
        <SummaryCard label="Setup" value={summary.setup} />
        <SummaryCard label="Alarm" value={summary.alarm} danger />
        <SummaryCard label="Stop" value={summary.stop} />
        <SummaryCard label="Total" value={summary.total} />
      </div>

      {/* Danh sách máy */}
      <div className="card grow d-flex flex-column overflow-hidden">
        <div className="card-header d-flex justify-content-between align-items-center shrink-0">
          <strong>Trạng thái realtime</strong>
          <span>{now.format("DD/MM/YYYY HH:mm:ss")}</span>
        </div>

        <div className="card-body overflow-hidden">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="spinner-border" />
            </div>
          ) : (
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
          )}
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
  danger,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="col">
      <div className="card text-center h-100">
        <div className="card-body">
          <div className="text-muted">{label}</div>
          <h3 className={danger ? "text-danger" : ""}>{value}</h3>
        </div>
      </div>
    </div>
  );
}
