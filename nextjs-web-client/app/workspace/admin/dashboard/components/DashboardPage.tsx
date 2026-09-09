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
import { Button, Card, Tooltip } from "antd";
import DetailPlant from "./DetailPlant";

export const statusConfig: Record<
  MachineStatus,
  {
    text: string;
    badge: string;
    border: string;
    bg: string;
    textColor: string;
    icon: string;
  }
> = {
  [MachineStatus.None]: {
    text: "NONE",
    badge: "bg-dark text-white",
    border: "border-dark",
    bg: "bg-secondary",
    textColor: "text-white",
    icon: "bi-circle",
  },

  [MachineStatus.Running]: {
    text: "RUNNING",
    badge: "bg-success text-white",
    border: "border-success",
    bg: "bg-success",
    textColor: "text-white",
    icon: "bi-play-circle-fill",
  },

  [MachineStatus.Paused]: {
    text: "PAUSED",
    badge: "bg-warning text-dark",
    border: "border-warning",
    bg: "bg-warning",
    textColor: "text-dark",
    icon: "bi-pause-circle-fill",
  },

  [MachineStatus.Stopped]: {
    text: "STOPPED",
    badge: "bg-secondary text-white",
    border: "border-secondary",
    bg: "bg-secondary",
    textColor: "text-white",
    icon: "bi-stop-circle-fill",
  },

  [MachineStatus.Alarm]: {
    text: "ALARM",
    badge: "bg-danger text-white",
    border: "border-danger",
    bg: "bg-danger",
    textColor: "text-white",
    icon: "bi-exclamation-triangle-fill",
  },

  [MachineStatus.Maintenance]: {
    text: "MAINTENANCE",
    badge: "bg-primary text-white",
    border: "border-primary",
    bg: "bg-primary",
    textColor: "text-white",
    icon: "bi-tools",
  },
};

export function DashboardPage() {
  const [now, setNow] = useState(dayjs());
  const [machineLogs, setMachineLogs] = useState<MachineLog[]>([]);
  const [machines, setMachines] = useState<Machine[] | null>(null);

  const [showPlan, setShowPlan] = useState(false);
  const [machineLog, setMachineLog] = useState<MachineLog | null>(null);

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
      running: machineLogs.filter(
        (x) => x.machineStatus === MachineStatus.Running,
      ).length,
      paused: machineLogs.filter(
        (x) => x.machineStatus === MachineStatus.Paused,
      ).length,
      stopped: machineLogs.filter(
        (x) => x.machineStatus === MachineStatus.Stopped,
      ).length,
      alarm: machineLogs.filter((x) => x.machineStatus === MachineStatus.Alarm)
        .length,
      maintenance: machineLogs.filter(
        (x) => x.machineStatus === MachineStatus.Maintenance,
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
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-3">
              {machineLogs.map((log) => (
                <div
                  key={`${log.id}-${String(log.machineStatusChangeAt)}`}
                  className="col"
                >
                  <MachineCard
                    machineLog={log}
                    onViewTodayPlan={(log) => {
                      setMachineLog(log);
                      setShowPlan(true);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DetailPlant
        open={showPlan}
        machineId={machineLog?.id || null}
        onClose={() => setShowPlan(false)}
      />
    </div>
  );
}

function MachineCard({
  machineLog,
  onViewTodayPlan,
}: {
  machineLog: MachineLog;
  onViewTodayPlan: (log: MachineLog) => void;
}) {
  const cfg = statusConfig[machineLog.machineStatus];

  const handleViewTodayPlan = (machine: MachineLog) => {
    onViewTodayPlan(machine);
  };

  return (
    <Card
      className={`
    h-full
    overflow-hidden
    rounded-xl
    border
    border-slate-200
    border-l-[5px]
    shadow-sm
    transition-all duration-200
    hover:-translate-y-0.5
    hover:shadow-md
    ${cfg?.border ?? "border-l-slate-400"}
  `}
      styles={{
        body: {
          padding: 0,
          height: "100%",
        },
      }}
    >
      <div className="flex h-full flex-col">
        {/* Hàng 1: Trạng thái máy */}
        <div
          className={`
        flex min-h-19
        items-center justify-center
        overflow-hidden
        px-4 py-3
        ${cfg?.bg ?? "bg-slate-100"}
      `}
        >
          <div
            className={`
          flex min-h-16
          w-full
          items-center justify-center
          rounded-lg
          px-4 py-3
          text-center
          text-xl font-extrabold
          uppercase tracking-wider
          shadow-sm
          md:text-2xl
          ${cfg?.badge ?? "bg-slate-700 text-white"}
        `}
          >
            <i className={`bi ${cfg?.icon ?? "bi-circle"} me-2`} />

            <span className="truncate">
              {cfg?.text ?? machineLog?.machineStatus ?? "-"}
            </span>
          </div>
        </div>

        {/* Hàng 2: Tên máy */}
        <div
          className="
        flex min-h-25
        flex-col items-center justify-center
        border-b border-slate-200
        bg-white
        px-4 py-4
        text-center
      "
        >
          <Tooltip title={machineLog?.name}>
            <div
              className="
              w-full
              truncate
              text-2xl font-bold
              text-slate-800
              md:text-3xl
            "
            >
              {machineLog?.name ?? "-"}
            </div>
          </Tooltip>

          <div className="mt-1 text-sm font-semibold text-slate-500">
            {machineLog?.code ?? "-"}
          </div>

          {machineLog?.type && (
            <div className="mt-1 w-full truncate text-xs text-slate-400">
              {machineLog.type}
            </div>
          )}
        </div>

        {/* Hàng 3: Part code + nút kế hoạch */}
        <div
          className="
            flex min-h-23
            items-center justify-between
            gap-3
            bg-slate-50
            px-4 py-3
          "
        >
          <div className="min-w-0 flex-1">
            <div
              className="
                text-xs font-semibold
                uppercase tracking-wider
                text-slate-500
              "
            >
              Part Code
            </div>

            <Tooltip title={machineLog?.part?.code}>
              <div
                className="
                  mt-1
                  w-full truncate
                  text-xl font-bold
                  text-slate-800
                "
              >
                {machineLog?.part?.code ?? "-"}
              </div>
            </Tooltip>
          </div>

          <Button
            type="primary"
            size="small"
            className="
              flex!
              shrink-0
              items-center
              justify-center
              rounded-lg!
              px-3!
              font-semibold
              shadow-sm
              transition-transform duration-200
              hover:scale-105
            "
            icon={<i className="bi bi-calendar3" />}
            onClick={() => handleViewTodayPlan(machineLog)}
          >
            <span className="hidden md:inline">Kế hoạch hôm nay</span>
            <span className="md:hidden">Kế hoạch</span>
          </Button>
        </div>
      </div>
    </Card>
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
