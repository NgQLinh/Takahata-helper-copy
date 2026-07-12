"use client";

import {
  Button,
  Card,
  DatePicker,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import {
  CalendarOutlined,
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
  deletePartAsync,
  searchPartAsync,
} from "@/app/services/index/IndexService";
import { Part, PartProcess } from "@/app/types";
import { ApiError } from "@/app/types/common/ApiError";
import { ProcessStatus } from "@/app/types/common/ProcessStatus";

const { RangePicker } = DatePicker;

const PROCESS_COUNT = 15;

type RowType = "MC" | "P" | "A";
type DateRange = [Dayjs | null, Dayjs | null] | null;

type TableRow = {
  key: string;
  partId: number;
  indexCode?: string;
  partName?: string;
  createAt?: string;
  rowType: RowType;
  rowSpan: number;
  processes: Record<number, PartProcess | undefined>;
};

type SearchOverrides = {
  keyword?: string;
  statuses?: ProcessStatus[];
  planDateRange?: DateRange;
  actualDateRange?: DateRange;
  page?: number;
  pageSize?: number;
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
      createAt: formatDate(part.createAt),
      rowType: "MC",
      rowSpan: 3,
      processes: part.processes,
    },
    {
      key: `${part.id}-P`,
      partId: part.id,
      createAt: formatDate(part.createAt),
      rowType: "P",
      rowSpan: 0,
      processes: part.processes,
    },
    {
      key: `${part.id}-A`,
      partId: part.id,
      rowType: "A",
      rowSpan: 0,
      processes: part.processes,
    },
  ]);

export default function PartProcessingScheduleTab() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState<Part[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [total, setTotal] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [filterStatuses, setFilterStatuses] = useState<ProcessStatus[]>([]);
  const [filterPlanDateRange, setFilterPlanDateRange] = useState<DateRange>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [filterActualDateRange, setFilterActualDateRange] =
    useState<DateRange>(null);

  const fetchParts = useCallback(
    async (overrides: SearchOverrides = {}) => {
      const currentKeyword = overrides.keyword ?? keyword;
      const currentStatuses = overrides.statuses ?? filterStatuses;
      const currentPlanDateRange =
        overrides.planDateRange === undefined
          ? filterPlanDateRange
          : overrides.planDateRange;
      const currentActualDateRange =
        overrides.actualDateRange === undefined
          ? filterActualDateRange
          : overrides.actualDateRange;
      const currentPage = overrides.page ?? page;
      const currentPageSize = overrides.pageSize ?? pageSize;

      setLoading(true);

      try {
        const data = await searchPartAsync({
          searchText: currentKeyword,
          statuses: currentStatuses,
          plantFrom: currentPlanDateRange?.[0]?.format("YYYY-MM-DD") ?? null,
          plantTo: currentPlanDateRange?.[1]?.format("YYYY-MM-DD") ?? null,
          actualFrom: currentActualDateRange?.[0]?.format("YYYY-MM-DD") ?? null,
          actualTo: currentActualDateRange?.[1]?.format("YYYY-MM-DD") ?? null,
          page: currentPage,
          pageSize: currentPageSize,
        });

        setParts(data.data);
        setTotal(data.totalItems);
        setPage(data.page);
        setPageSize(data.pageSize);
      } catch {
        toast.error("Không thể tải danh sách part");
      } finally {
        setLoading(false);
      }
    },
    [
      filterActualDateRange,
      filterPlanDateRange,
      filterStatuses,
      keyword,
      page,
      pageSize,
    ],
  );

  useEffect(() => {
    const run = async () => {
      await fetchParts();
    };
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const dataSource = useMemo(() => mapPartsToRows(parts), [parts]);

  const handleUpdate = (id: number) => {
    setSelectedId(id);
    setIsUpdateOpen(true);
  };

  const handleDelete = async (id: number) => {
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
  };

  const handleResetFilters = async () => {
    const emptyRange: DateRange = [null, null];

    setKeyword("");
    setFilterStatuses([]);
    setFilterPlanDateRange(emptyRange);
    setFilterActualDateRange(emptyRange);
    setPage(1);

    await fetchParts({
      keyword: "",
      statuses: [],
      planDateRange: emptyRange,
      actualDateRange: emptyRange,
      page: 1,
    });
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
        onCell: (row) => ({ rowSpan: row.rowSpan }),
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
        width: 150,
        fixed: "left",
        onCell: (row) => ({ rowSpan: row.rowSpan }),
        render: (_, row) => (
          <strong className="part-name">{row.partName}</strong>
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
        children: Array.from({ length: PROCESS_COUNT }, (_, sequence) => ({
          title: <span className="process-number">{sequence}</span>,
          dataIndex: `process-${sequence}`,
          width: 100,
          align: "center" as const,
          render: (_: unknown, row: TableRow) => {
            const process = row.processes[sequence];

            if (!process) return <span className="empty-cell">-</span>;

            if (row.rowType === "MC") {
              return process.status === ProcessStatus.Completed ? (
                <Tag color="success" className="process-tag">
                  {process.machine?.code}
                </Tag>
              ) : (
                <span className="machine-name">{process.machine?.name}</span>
              );
            }

            if (row.rowType === "P") {
              return (
                <span className="plan-date">
                  <CalendarOutlined /> {formatDate(process.planDate)}
                </span>
              );
            }

            if (!process.actualDate) {
              return <span className="empty-cell">-</span>;
            }

            return (
              <span className="actual-date">
                <CalendarOutlined /> {formatDate(process.actualDate)}
                {process.workingHours ? ` - ${process.workingHours}` : ""}
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
        onCell: (row) => ({ rowSpan: row.rowSpan }),
        render: (_: unknown, row: TableRow) => (
          <Space size={8}>
            <Button
              icon={<EditOutlined />}
              className="action-btn"
              onClick={() => handleUpdate(row.partId)}
            >
              Sửa
            </Button>

            <Popconfirm
              title="Xóa part"
              description={`Bạn có chắc muốn xóa ${row.partName}?`}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => handleDelete(row.partId)}
            >
              <Button danger icon={<DeleteOutlined />} className="delete-btn">
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    // Các handler sử dụng state hiện tại từ component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchParts],
  );

  return (
    <>
      <Card>
        <div className="d-flex justify-content-between gap-3 flex-wrap">
          <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
            <div style={{ width: 200 }}>
              <label className="form-label mb-1">Part Name</label>
              <Input
                placeholder="Nhập Part Name"
                allowClear
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>

            <div style={{ width: 240 }}>
              <label className="form-label mb-1">Trạng thái</label>
              <Select
                mode="multiple"
                allowClear
                maxTagCount="responsive"
                placeholder="Chọn trạng thái"
                value={filterStatuses}
                onChange={setFilterStatuses}
                style={{ width: "100%" }}
                options={[
                  { value: ProcessStatus.Planned, label: "Đã lên kế hoạch" },
                  { value: ProcessStatus.InProgress, label: "Đang thực hiện" },
                  { value: ProcessStatus.Completed, label: "Hoàn thành" },
                  { value: ProcessStatus.Cancelled, label: "Đã hủy" },
                  { value: ProcessStatus.Overdue, label: "Quá hạn" },
                ]}
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

            <div style={{ width: 270 }}>
              <label className="form-label mb-1">Thực tế</label>
              <RangePicker
                value={filterActualDateRange}
                onChange={setFilterActualDateRange}
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder={["Từ ngày", "Đến ngày"]}
              />
            </div>

            <Button onClick={() => void handleResetFilters()}>
              Xóa bộ lọc
            </Button>

            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => {
                if (page === 1) {
                  void fetchParts({ page: 1 });
                } else {
                  setPage(1);
                }
              }}
            >
              Tìm kiếm
            </Button>
          </div>

          <div className="d-flex align-items-end mb-3">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateOpen(true)}
            >
              Thêm part
            </Button>
          </div>
        </div>

        <Table<TableRow>
          bordered
          size="middle"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          tableLayout="fixed"
          rowKey="key"
          scroll={{
            x: "max-content",
            y: "calc(100vh - 510px)",
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
        />
      </Card>

      <CreatePart
        open={isCreateOpen}
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
