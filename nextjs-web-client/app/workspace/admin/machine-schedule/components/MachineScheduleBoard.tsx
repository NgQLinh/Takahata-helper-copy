"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, DatePicker, Input, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

import { searchMachineSchedulesAsync } from "@/app/services/machine/MachineService";
import { MachineProcessType, MachineSchedule } from "@/app/types";
import { ProcessStatus } from "@/app/types/common/ProcessStatus";

import "./MachineScheduleBoard.css";

const { RangePicker } = DatePicker;

dayjs.extend(isoWeek);

type DateRange = [Dayjs | null, Dayjs | null] | null;

const getCurrentWeekRange = (): DateRange => [
  dayjs().startOf("isoWeek"),
  dayjs().endOf("isoWeek"),
];

const formatDate = (date: string) => {
  return dayjs(date).format("DD/MM");
};

const getStatusText = (status: ProcessStatus) => {
  switch (status) {
    case ProcessStatus.Planned:
      return "PLANNED";

    case ProcessStatus.InProgress:
      return "IN PROGRESS";

    case ProcessStatus.Completed:
      return "DONE";

    case ProcessStatus.Cancelled:
      return "CANCELLED";

    case ProcessStatus.Overdue:
      return "OVERDUE";

    default:
      return "UNKNOWN";
  }
};

const getStatusClassName = (status: ProcessStatus) => {
  switch (status) {
    case ProcessStatus.Completed:
      return "timeline-card timeline-card-done";

    case ProcessStatus.InProgress:
      return "timeline-card timeline-card-in-progress";

    case ProcessStatus.Cancelled:
      return "timeline-card timeline-card-cancelled";

    case ProcessStatus.Overdue:
      return "timeline-card timeline-card-overdue";

    case ProcessStatus.Planned:
    default:
      return "timeline-card timeline-card-planned";
  }
};

export function MachineScheduleBoard() {
  const [loading, setLoading] = useState(false);
  const [machines, setMachines] = useState<MachineSchedule[]>([]);

  /*
   * Giá trị đang nhập trên giao diện.
   */
  const [keyword, setKeyword] = useState("");
  const [filterPlanDateRange, setFilterPlanDateRange] =
    useState<DateRange>(getCurrentWeekRange);

  /*
   * Giá trị thực tế dùng để gọi API.
   * Tách riêng để API chỉ chạy khi nhấn "Tìm kiếm".
   */
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchPlanDateRange, setSearchPlanDateRange] =
    useState<DateRange>(getCurrentWeekRange);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [total, setTotal] = useState(0);

  const fetchMachineSchedule = useCallback(async () => {
    setLoading(true);

    try {
      const response = await searchMachineSchedulesAsync({
        keyword: searchKeyword.trim(),
        plantFrom: searchPlanDateRange?.[0]?.format("YYYY-MM-DD") ?? null,
        plantTo: searchPlanDateRange?.[1]?.format("YYYY-MM-DD") ?? null,
        page,
        pageSize,
      });

      setMachines(response.data ?? []);
      setPage(response.page);
      setPageSize(response.pageSize);
      setTotal(response.totalItems);
    } catch {
      toast.error("Không thể tải danh sách kế hoạch");
    } finally {
      setLoading(false);
    }
  }, [searchKeyword, searchPlanDateRange, page, pageSize]);

  useEffect(() => {
    const run = async () => {
      await fetchMachineSchedule();
    };
    void run();
  }, [fetchMachineSchedule]);

  /*
   * Sinh tất cả ngày trong khoảng lọc.
   *
   * Ví dụ:
   * 13/07/2026 - 19/07/2026
   *
   * Timeline sẽ luôn có đủ 7 cột, kể cả ngày không có process.
   */
  const dates = useMemo(() => {
    const fromDate = searchPlanDateRange?.[0];
    const toDate = searchPlanDateRange?.[1];

    if (!fromDate || !toDate) {
      return [];
    }

    const result: string[] = [];
    let currentDate = fromDate.startOf("day");
    const endDate = toDate.startOf("day");

    while (
      currentDate.isBefore(endDate, "day") ||
      currentDate.isSame(endDate, "day")
    ) {
      result.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }

    return result;
  }, [searchPlanDateRange]);

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setSearchPlanDateRange(filterPlanDateRange);

    if (page !== 1) {
      setPage(1);
      return;
    }

    /*
     * Khi đang ở trang 1 và giá trị tìm kiếm không thay đổi,
     * useEffect có thể không chạy lại, nên gọi trực tiếp.
     */
    if (
      searchKeyword === keyword &&
      searchPlanDateRange?.[0]?.isSame(
        filterPlanDateRange?.[0] ?? null,
        "day",
      ) &&
      searchPlanDateRange?.[1]?.isSame(filterPlanDateRange?.[1] ?? null, "day")
    ) {
      void fetchMachineSchedule();
    }
  };

  const handleResetFilters = () => {
    const currentWeekRange = getCurrentWeekRange();

    setKeyword("");
    setFilterPlanDateRange(currentWeekRange);

    setSearchKeyword("");
    setSearchPlanDateRange(currentWeekRange);

    setPage(1);
  };

  const columns: ColumnsType<MachineSchedule> = useMemo(() => {
    const machineColumn: ColumnsType<MachineSchedule>[number] = {
      title: "Máy",
      dataIndex: "name",
      key: "machine",
      fixed: "left",
      width: 220,
      render: (_, machine) => (
        <div className="machine-information">
          <div className="fw-bold">{machine.name}</div>

          <div className="text-muted small mt-1">
            {machine.code}
            {machine.type ? ` - ${machine.type}` : ""}
          </div>

          {machine.brand && (
            <Tag color="blue" className="mt-2">
              {machine.brand}
            </Tag>
          )}
        </div>
      ),
    };

    const timelineColumns: ColumnsType<MachineSchedule> = dates.map((date) => ({
      title: (
        <div className="timeline-date-header">
          <div className="fw-semibold">{formatDate(date)}</div>
          <div className="small text-muted">{dayjs(date).format("ddd")}</div>
        </div>
      ),
      key: date,
      width: 300,
      align: "center",
      render: (_: unknown, machine: MachineSchedule) => {
        const processes = machine.processes.filter((process) => {
          if (!process.plantDate) {
            return false;
          }

          return dayjs(process.plantDate).format("YYYY-MM-DD") === date;
        });

        if (processes.length === 0) {
          return <div className="timeline-empty-box">Không có kế hoạch</div>;
        }

        return (
          <div className="d-flex flex-column gap-2">
            {processes.map((process) => {
              const isMaintenance =
                process.type === MachineProcessType.Maintenance;

              return (
                <div
                  key={`${process.type}-${process.id}`}
                  className={`rounded-3 border p-2 ${
                    isMaintenance
                      ? "border-danger-subtle bg-danger-subtle"
                      : getStatusClassName(process.status)
                  }`}
                  style={{
                    minWidth: 220,
                    textAlign: "left",
                  }}
                >
                  {/* Header */}
                  <div className="d-flex align-items-start justify-content-between gap-2">
                    <div className="grow overflow-hidden">
                      <div
                        className={`fw-semibold text-truncate ${
                          isMaintenance ? "text-danger" : ""
                        }`}
                        title={isMaintenance ? "Bảo trì" : process.partCode}
                      >
                        {isMaintenance
                          ? "🔧 Bảo trì"
                          : `📦 ${process.partCode}`}
                      </div>
                    </div>

                    <Tag
                      color={isMaintenance ? "red" : undefined}
                      className="m-0 shrink-0"
                    >
                      {getStatusText(process.status)}
                    </Tag>
                  </div>

                  {/* Nội dung */}
                  <div
                    className="small mt-2 text-body-secondary"
                    style={{
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                    }}
                  >
                    {process.note || "Không có ghi chú"}
                  </div>

                  {/* Thông tin bổ sung */}
                  <div className="d-flex flex-wrap align-items-center gap-x-3 gap-y-1 mt-2">
                    {isMaintenance ? (
                      <>
                        {process.startTime && (
                          <div className="small text-muted">
                            <span className="fw-medium">Thực tế:</span>{" "}
                            {process.startTime}
                          </div>
                        )}

                        {process.workingTime != null && (
                          <div className="small text-muted">
                            <span className="fw-medium">Giờ máy:</span>{" "}
                            {process.workingTime}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="small text-muted">
                        <span className="fw-medium">Số lượng:</span>{" "}
                        {process.quantity}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      },
    }));

    return [machineColumn, ...timelineColumns];
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
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <div className="d-flex justify-content-between gap-3 flex-wrap">
        <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
          <div style={{ width: 240 }}>
            <label className="form-label mb-1">Tên hoặc mã máy</label>

            <Input
              placeholder="Nhập tên hoặc mã máy"
              allowClear
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              onPressEnter={handleSearch}
            />
          </div>

          <div style={{ width: 280 }}>
            <label className="form-label mb-1">Khoảng ngày kế hoạch</label>

            <RangePicker
              value={filterPlanDateRange}
              onChange={(value) => setFilterPlanDateRange(value)}
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
              allowClear={false}
            />
          </div>

          <Button onClick={handleResetFilters}>Xóa bộ lọc</Button>

          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <Table<MachineSchedule>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={machines}
          scroll={{
            x: 220 + dates.length * 190,
            y: "calc(100vh - 260px)",
          }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
            showTotal: (value) => `Tổng ${value} máy`,
            onChange: (newPage, newPageSize) => {
              /*
               * Khi đổi page size nên quay lại trang 1 để tránh
               * trang hiện tại vượt quá tổng số trang.
               */
              if (newPageSize !== pageSize) {
                setPage(1);
                setPageSize(newPageSize);
                return;
              }

              setPage(newPage);
            },
          }}
          bordered
        />
      </div>
    </Card>
  );
}
