"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Table, Tag, Empty } from "antd";
import type { ColumnsType } from "antd/es/table";
import Title from "antd/es/typography/Title";
import { toast } from "react-toastify";
import { getMachineSchedulesAsync } from "@/app/services/machine/MachineService";
import { MachineSchedule } from "@/app/types";
import "./MachineScheduleBoard.css";
export function MachineScheduleBoard() {
  const [loading, setLoading] = useState(false);
  const [machines, setMachines] = useState<MachineSchedule[]>([]);

  const fetchMachineSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMachineSchedulesAsync();
      setMachines(data ?? []);
    } catch {
      toast.error("Không thể tải danh sách kế hoạch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      void fetchMachineSchedule();
    };
    void run();
  }, [fetchMachineSchedule]);

  const dates = useMemo(() => {
    const allDates = machines.flatMap((m) =>
      m.partProcesses.map((p) => p.planDate),
    );

    return Array.from(new Set(allDates)).sort();
  }, [machines]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const columns: ColumnsType<MachineSchedule> = useMemo(() => {
    return [
      {
        title: "Machine",
        dataIndex: "name",
        key: "machine",
        fixed: "left",
        width: 100,
        render: (_, machine) => (
          <div>
            <div className="fw-bold">{machine.name}</div>
            <div className="text-muted small">
              {machine.code} - {machine.type}
            </div>
            <Tag color="blue" className="mt-2">
              {machine.brand}
            </Tag>
          </div>
        ),
      },
      ...dates.map((date) => ({
        title: formatDate(date),
        key: date,
        width: 170,
        align: "center" as const,
        render: (_: unknown, machine: MachineSchedule) => {
          const processes = machine.partProcesses.filter(
            (p) => p.planDate === date,
          );

          if (processes.length === 0) {
            return <div className="timeline-empty-box" />;
          }

          return (
            <div className="d-flex flex-column gap-2">
              {processes.map((process) => (
                <div
                  key={`${process.partId}-${process.sequence}`}
                  className={
                    process.isCompleted
                      ? "timeline-card timeline-card-done"
                      : "timeline-card timeline-card-planned"
                  }
                >
                  <div className="fw-bold">Part #{process.partId}</div>

                  <div className="small text-muted">
                    Sequence {process.sequence}
                  </div>

                  <div className="d-flex justify-content-between mt-2 small">
                    <span>{process.note || "No note"}</span>
                    <span>{process.isCompleted ? "DONE" : "PLANNED"}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        },
      })),
    ];
  }, [dates]);

  return (
    <div
      className="h-100 d-flex flex-column gap-3 overflow-hidden"
      style={{ minHeight: 0 }}
    >
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Title level={3} style={{ margin: 0 }}>
            Lịch gia công theo máy, ngày và work order
          </Title>
        </div>
      </Card>

      <Card
        className="grow overflow-hidden"
        style={{ minHeight: 0 }}
        styles={{
          body: {
            height: "100%",
            overflow: "hidden",
            padding: 12,
          },
        }}
      >
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={machines}
          pagination={false}
          bordered
          scroll={{
            x: 260 + dates.length * 170,
            y: "calc(100vh - 260px)",
          }}
        />
      </Card>
    </div>
  );
}
