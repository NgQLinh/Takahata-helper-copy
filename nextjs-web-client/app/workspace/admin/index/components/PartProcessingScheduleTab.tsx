"use client";

import { Button, Card, DatePicker, Input, Popconfirm, Table, Tag } from "antd";
import {
  CalendarOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import CreatePart from "./CreatePart";
import UpdatePart from "./UpdatePart";
import {
  approvePartAsync,
  deletePartAsync,
  searchPartAsync,
} from "@/app/services/index/IndexService";
import { Part, PartProcess, PartType } from "@/app/types";
import { ApiError } from "@/app/types/common/ApiError";
import { ProcessStatus } from "@/app/types/common/ProcessStatus";
import { PartTypeLabels } from "@/app/types/part/PartTypeLabels";

const { RangePicker } = DatePicker;

type RowType = "MC" | "P" | "A";
type DateRange = [Dayjs | null, Dayjs | null] | null;

type TableRow = {
  key: string;
  partId: number;
  indexCode?: string;
  partName?: string;
  createBy?: string;
  createAt?: Dayjs | null;
  updateBy?: string | null;
  updateAt?: Dayjs | null;
  rowType: RowType;
  rowSpan: number;
  status: ProcessStatus | null;
  processes: Record<number, PartProcess | undefined>;
  prioritize?: boolean;
  partType: PartType;
};

const formatDate = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const mapPartsToRows = (parts: Part[]): TableRow[] =>
  parts.flatMap((part) => [
    {
      key: `${part.id}-MC`,
      partId: part.id,
      indexCode: part.index?.code,
      partName: part.code,
      createAt: part.createAt ? dayjs(part.createAt) : null,
      createBy: part.createBy,
      updateBy: part.updateBy,
      updateAt: part.updateAt ? dayjs(part.updateAt) : null,
      rowType: "MC",
      rowSpan: 3,
      processes: part.processes,
      status: part.status,
      prioritize: part.prioritize,
      partType: part.partType,
    },
    {
      key: `${part.id}-P`,
      partId: part.id,
      createAt: part.createAt ? dayjs(part.createAt) : null,
      rowType: "P",
      rowSpan: 0,
      processes: part.processes,
      status: part.status,
      partType: part.partType,
    },
    {
      key: `${part.id}-A`,
      partId: part.id,
      rowType: "A",
      rowSpan: 0,
      processes: part.processes,
      status: part.status,
      partType: part.partType,
    },
  ]);

interface Props {
  active: boolean;
}

export default function PartProcessingScheduleTab({ active }: Props) {
  const [processCount, setProcessCount] = useState<number>(14);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState<Part[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [total, setTotal] = useState(0);

  const [partCode, setPartCode] = useState("");
  const [indexCode, setIndexCode] = useState("");
  const [filterStatuses, setFilterStatuses] = useState<ProcessStatus[]>([]);
  const [filterPlanDateRange, setFilterPlanDateRange] = useState<DateRange>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [filterStartDateRange, setFilterStartDateRange] =
    useState<DateRange>(null);

  const fetchParts = useCallback(
    async (currentPage = page, currentPageSize = pageSize) => {
      setLoading(true);

      try {
        const data = await searchPartAsync({
          indexCode: indexCode,
          partCode: partCode,
          statuses: filterStatuses,
          plantFrom: filterPlanDateRange?.[0]?.format("YYYY-MM-DD") ?? null,
          plantTo: filterPlanDateRange?.[1]?.format("YYYY-MM-DD") ?? null,
          startFrom: filterStartDateRange?.[0]?.format("YYYY-MM-DD") ?? null,
          startTo: filterStartDateRange?.[1]?.format("YYYY-MM-DD") ?? null,
          page: currentPage,
          pageSize: currentPageSize,
        });

        setParts(data.data);
        setTotal(data.totalItems);
        setPage(data.page ?? currentPage);
        setPageSize(data.pageSize ?? currentPageSize);

        if (parts) {
          const partWithMostProcesses = parts.length
            ? parts.reduce((max, current) =>
                current.processes.length > max.processes.length ? current : max,
              )
            : null;

          if (partWithMostProcesses) {
            setProcessCount(
              partWithMostProcesses.processes.length < 15
                ? 15
                : partWithMostProcesses.processes.length + 1,
            );
          }
        }
      } catch {
        toast.error("Không thể tải danh sách part");
      } finally {
        setLoading(false);
      }
    },
    [
      page,
      pageSize,
      indexCode,
      partCode,
      filterStatuses,
      filterPlanDateRange,
      filterStartDateRange,
      parts,
    ],
  );

  useEffect(() => {
    const run = async () => {
      await fetchParts();
    };
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const dataSource = useMemo(() => mapPartsToRows(parts), [parts]);

  const handleUpdate = (id: number) => {
    setSelectedId(id);
    setIsUpdateOpen(true);
  };

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deletePartAsync(id);
        toast.success("Xóa part thành công.");
        await fetchParts();
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.getDisplayMessage());
          return;
        }

        toast.error("Có lỗi xảy ra.");
      }
    },
    [fetchParts],
  );

  const handleApprove = useCallback(
    async (id: number) => {
      try {
        await approvePartAsync({ id });
        toast.success("Phê duyệt part thành công.");
        await fetchParts();
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.getDisplayMessage());
          return;
        }

        toast.error("Có lỗi xảy ra.");
      }
    },
    [fetchParts],
  );

  const handleResetFilters = async () => {
    const emptyRange: DateRange = [null, null];

    const currentMonthRange: DateRange = [
      dayjs().startOf("month"),
      dayjs().endOf("month"),
    ];

    setFilterStatuses([]);
    setFilterPlanDateRange(currentMonthRange);
    setFilterStartDateRange(emptyRange);
    setPage(1);

    await fetchParts();
  };

  const columns = useMemo<ColumnsType<TableRow>>(
    () => [
      {
        title: (
          <div className="schedule-th-center">
            Index
            <br />
            <span>(Tên)</span>
          </div>
        ),
        dataIndex: "indexCode",
        width: 130,
        fixed: "left",
        align: "center",
        onCell: (row) => ({
          rowSpan: row.rowSpan,
          style: {
            verticalAlign: "middle",
          },
        }),
        render: (_, row) => (
          <strong className="index-code">{row.indexCode}</strong>
        ),
      },
      {
        title: (
          <div className="schedule-th">
            Part Name
            <br />
            <span>(Tên chi tiết)</span>
          </div>
        ),
        dataIndex: "partName",
        width: 300,
        fixed: "left",
        onCell: (row) => ({
          rowSpan: row.rowSpan,
        }),
        render: (_, row) => (
          <Card>
            <div
              className="d-flex align-items-start justify-content-between gap-2 pb-2 mb-2"
              style={{
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div className="grow overflow-hidden">
                <div
                  className="fw-bold text-dark text-truncate"
                  title={row.partName || "-"}
                  style={{
                    fontSize: 15,
                  }}
                >
                  {row.partName || "-"}{" "}
                  {row.prioritize && <Tag color="orange">Ưu tiên</Tag>}
                </div>
              </div>
            </div>

            <div className="d-flex flex-column gap-2 small">
              <div className="d-flex justify-content-between gap-3">
                <span className="text-muted text-nowrap">Người tạo</span>
                <span
                  className="fw-semibold text-dark text-end text-truncate"
                  title={row.createBy || "-"}
                >
                  {row.createBy || "-"}
                </span>
              </div>

              <div className="d-flex justify-content-between gap-3">
                <span className="text-muted text-nowrap">Ngày tạo</span>
                <span className="text-dark text-end">
                  {row.createAt
                    ? dayjs(row.createAt).format("DD/MM/YYYY HH:mm")
                    : "-"}
                </span>
              </div>

              <div className="d-flex justify-content-between gap-3">
                <span className="text-muted text-nowrap">Loại gia công</span>

                <span
                  className="fw-semibold text-dark text-end text-truncate"
                  title={row.partType ? PartTypeLabels[row.partType] : "-"}
                >
                  {row.partType ? PartTypeLabels[row.partType] : "-"}
                </span>
              </div>

              {/* <div className="d-flex justify-content-between gap-3">
                <span className="text-muted text-nowrap">Người sửa</span>
                <span
                  className="fw-semibold text-dark text-end text-truncate"
                  title={row.updateBy || "-"}
                >
                  {row.updateBy || "-"}
                </span>
              </div>

              <div className="d-flex justify-content-between gap-3">
                <span className="text-muted text-nowrap">Ngày sửa</span>
                <span className="text-dark text-end">
                  {row.updateAt
                    ? dayjs(row.updateAt).format("DD/MM/YYYY HH:mm")
                    : "-"}
                </span>
              </div> */}
            </div>
          </Card>
        ),
      },
      {
        title: (
          <div className="schedule-th-center">
            Plan/Actual
            <br />
            <span>KH/TT</span>
          </div>
        ),
        dataIndex: "rowType",
        width: 120,
        fixed: "left",
        align: "center",
        onCell: () => ({
          style: {
            verticalAlign: "middle",
          },
        }),
        render: (value: RowType) => {
          const className =
            value === "MC"
              ? "row-type-mc"
              : value === "P"
                ? "row-type-plan"
                : "row-type-actual";

          return <span className={`row-type-badge ${className}`}>{value}</span>;
        },
      },
      {
        title: (
          <div className="schedule-group-title">
            PROCESSING SCHEDULE
            <br />
            <span>(Lịch trình gia công)</span>
          </div>
        ),
        align: "center",
        children: Array.from({ length: processCount }, (_, sequence) => ({
          title: <span>{sequence}</span>,
          dataIndex: `process-${sequence}`,
          width: 100,
          align: "center" as const,
          onCell: () => ({
            style: {
              verticalAlign: "middle",
            },
          }),
          render: (_: unknown, row: TableRow) => {
            const process = row.processes[sequence];

            if (!process) return <span className="empty-cell">-</span>;

            if (row.rowType === "MC") {
              return (
                <span className="machine-name">{process.machine?.name}</span>
              );
            }

            if (row.rowType === "P") {
              return (
                <span className="plan-date">
                  <CalendarOutlined /> {formatDate(process.plantDate)}-
                  {process.estimatedTime !== null ? process.estimatedTime : "-"}
                  h
                </span>
              );
            }

            if (!process.startTime) {
              return <span className="empty-cell">-</span>;
            }

            return (
              <span className="actual-date">
                <CalendarOutlined />
                {dayjs(process.startTime).format("DD/MM")}-
                {(process.workingTime != null || process.setupTime != null) && (
                  <>
                    {Number(
                      (
                        ((process.workingTime ?? 0) +
                          (process.setupTime ?? 0)) /
                        60
                      ).toFixed(2),
                    )}
                    h
                  </>
                )}
              </span>
            );
          },
        })),
      },
      {
        title: "Thao tác",
        key: "actions",
        fixed: "right",
        width: 180,

        onCell: (row) => ({
          rowSpan: row.rowSpan,
          style: {
            verticalAlign: "middle",
          },
        }),
        render: (_: unknown, row: TableRow) => (
          <div className="d-flex flex-column gap-2" style={{ width: 220 }}>
            {/* Hàng trên */}
            <div className="d-flex gap-2">
              <Button
                icon={<EditOutlined />}
                className="action-btn flex-fill"
                onClick={() => handleUpdate(row.partId)}
              >
                Cập nhật
              </Button>
              <Popconfirm
                title="Xóa part"
                description={
                  <div style={{ lineHeight: 1.6 }}>
                    <p style={{ margin: 0 }}>
                      Bạn có chắc chắn muốn xóa part{" "}
                      <strong>{row.partName}</strong>?
                    </p>
                    
                    <p style={{ margin: "8px 0 0", color: "#faad14" }}>
                      <strong>Lưu ý:</strong> Xóa part sẽ xóa toàn bộ dữ liệu
                      nguyên công của part đó.
                    </p>
                  </div>
                }
                okText="Xóa"
                cancelText="Hủy"
                onConfirm={() => handleDelete(row.partId)}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  className="delete-btn flex-fill"
                >
                  Xóa
                </Button>
              </Popconfirm>
            </div>

            {/* Hàng dưới */}
            {row.status === ProcessStatus.PendingApproval && (
              <Popconfirm
                title="Phê duyệt Part"
                description={`Bạn có chắc muốn phê duyệt ${row.partName}?`}
                okText="Phê duyệt"
                cancelText="Hủy"
                onConfirm={() => handleApprove(row.partId)}
              >
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  className="w-100"
                >
                  Phê duyệt
                </Button>
              </Popconfirm>
            )}
          </div>
        ),
      },
    ],
    [handleApprove, handleDelete, processCount],
  );

  return (
    <>
      <Card>
        <div className="d-flex justify-content-between gap-3 flex-wrap">
          <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
            <div style={{ width: 200 }}>
              <label className="form-label mb-1">Index</label>
              <Input
                placeholder="Nhập Index"
                allowClear
                value={indexCode}
                onChange={(event) => setIndexCode(event.target.value)}
              />
            </div>
            <div style={{ width: 200 }}>
              <label className="form-label mb-1">Part Name</label>
              <Input
                placeholder="Nhập Part Name"
                allowClear
                value={partCode}
                onChange={(event) => setPartCode(event.target.value)}
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

            <Button onClick={() => void handleResetFilters()}>
              Tháng hiện tại
            </Button>

            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={async () => {
                setPage(1);
                await fetchParts(1, pageSize);
              }}
            >
              Tìm kiếm
            </Button>
          </div>

          <div className="d-flex align-items-end mb-3">
            <Button
              icon={<PlusOutlined />}
              onClick={() => setIsCreateOpen(true)}
            >
              Thêm part
            </Button>
          </div>
        </div>

        <Table<TableRow>
          bordered
          size="small"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          tableLayout="fixed"
          rowKey="key"
          scroll={{
            x: "max-content",
            y: "calc(100vh - 360px)",
          }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (value) => `Tổng ${value} part`,
            onChange: (current, size) => {
              setPage(current);
              setPageSize(size);
              void fetchParts(current, size);
            },
          }}
        />
      </Card>

      <CreatePart
        open={isCreateOpen}
        status={ProcessStatus.Planned}
        onClose={() => {
          setIsCreateOpen(false);
          void fetchParts();
        }}
      />

      <UpdatePart
        id={selectedId}
        open={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setSelectedId(null);
          void fetchParts();
        }}
      />
    </>
  );
}
