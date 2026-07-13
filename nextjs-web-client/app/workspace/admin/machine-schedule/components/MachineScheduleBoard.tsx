"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, DatePicker, Input, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { toast } from "react-toastify";
import { getMachineSchedulesAsync } from "@/app/services/machine/MachineService";
import { MachineSchedule } from "@/app/types";
import "./MachineScheduleBoard.css";
import { ProcessStatus } from "@/app/types/common/ProcessStatus";
import dayjs, { Dayjs } from "dayjs";
import { SearchOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
type DateRange = [Dayjs | null, Dayjs | null] | null;

export function MachineScheduleBoard() {
  const [loading, setLoading] = useState(false);
  const [machines, setMachines] = useState<MachineSchedule[]>([]);

  const [keyword, setKeyword] = useState("");
  const [filterPlanDateRange, setFilterPlanDateRange] = useState<DateRange>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [total, setTotal] = useState(0);

  const handleResetFilters = async () => {
    const emptyRange: DateRange = [null, null];

    setKeyword("");
    setFilterPlanDateRange(emptyRange);
    setPage(1);

    const data = await getMachineSchedulesAsync();
    setMachines(data ?? []);
  };

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
                    process.status === ProcessStatus.Completed
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
                    <span>
                      {process.status === ProcessStatus.Completed
                        ? "DONE"
                        : "PLANNED"}
                    </span>
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
      <div className="d-flex justify-content-between gap-3 flex-wrap">
        <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
          <div style={{ width: 200 }}>
            <label className="form-label mb-1">Tên máy</label>
            <Input
              placeholder="Nhập tên máy"
              allowClear
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>

          <div style={{ width: 270 }}>
            <label className="form-label mb-1">Kế hoạch</label>
            <RangePicker
              value={filterPlanDateRange}
              onChange={setFilterPlanDateRange}
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </div>

          <Button onClick={() => void handleResetFilters()}>Xóa bộ lọc</Button>

          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => {
              if (page === 1) {
                void fetchMachineSchedule();
              } else {
                setPage(1);
              }
            }}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={machines}
        scroll={{
          x: 260 + dates.length * 170,
          y: "calc(100vh - 240px)",
        }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (value) => `Tổng ${value} part`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
        bordered
      />
    </Card>
  );
}
