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
  Tabs,
  TabsProps,
  Tag,
  Typography,
} from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ScheduleOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useMemo, useState } from "react";
import CreatePart from "./CreatePart";
import {
  deletePartAsync,
  searchPartAsync,
} from "@/app/services/index/IndexService";
import { toast } from "react-toastify";
import { ApiError } from "@/app/types/common/ApiError";
import UpdatePart from "./UpdatePart";
import { Part, PartProcess } from "@/app/types";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

import "./IndexPage.css";
import dayjs, { Dayjs } from "dayjs";
import { ProcessStatus } from "@/app/types/common/ProcessStatus";

type RowType = "MC" | "P" | "A";

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

const processCount = 15;

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const mapPartsToRows = (parts: Part[]): TableRow[] => {
  return parts.flatMap((part) => {
    return [
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
    ];
  });
};

export function IndexPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState<Part[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [total, setTotal] = useState(0);

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Filter state
  const [keyword, setKeyword] = useState("");
  const [filterStatuses, setFilterStatuses] = useState<ProcessStatus[]>([]);
  const [filterPlantDateRange, setFilterPlantDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >([dayjs().startOf("month"), dayjs().endOf("month")]);
  const [filterActualDateRange, setFilterActualDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  const fetchParts = async () => {
    setLoading(true);
    try {
      const request = {
        searchText: keyword,
        statuses: filterStatuses,
        plantFrom: filterPlantDateRange?.[0]
          ? filterPlantDateRange[0].format("YYYY-MM-DD")
          : null,
        plantTo: filterPlantDateRange?.[1]
          ? filterPlantDateRange[1].format("YYYY-MM-DD")
          : null,
        actualFrom: filterActualDateRange?.[0]
          ? filterActualDateRange[0].format("YYYY-MM-DD")
          : null,
        actualTo: filterActualDateRange?.[1]
          ? filterActualDateRange[1].format("YYYY-MM-DD")
          : null,
        page: page,
        pageSize: pageSize,
      };

      const data = await searchPartAsync(request);
      setParts(data.data);
      setTotal(data.totalItems);
      setPage(data.page);
      setPageSize(data.pageSize);
    } catch {
      toast.error("Không thể tải danh sách part");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      try {
        await fetchParts();
      } catch {
        toast.error("Không thể tải danh sách part");
      }
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const dataSource = useMemo(() => {
    return mapPartsToRows(parts);
  }, [parts]);

  const handlerUpdate = (id: number) => {
    setSelectedId(id);
    setIsUpdateOpen(true);
  };

  const handlerDelete = async (id: number) => {
    await deletePartAsync(id)
      .then((data) => {
        console.log(data);
        fetchParts();
        toast.success("Xóa part thành công.");
      })
      .catch((error) => {
        if (error instanceof ApiError) {
          toast.error(error.getDisplayMessage());
          return;
        }
        toast.error("Có lỗi xảy ra.");
      });
  };

  const columns: ColumnsType<TableRow> = [
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
      width: 150,
      fixed: "left",
      onCell: (row) => ({
        rowSpan: row.rowSpan,
      }),
      render: (_, row) => <strong className="part-name">{row.partName}</strong>,
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
      render: (value) => {
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
      children: Array.from({ length: processCount }, (_, index) => {
        const sequence = index;

        return {
          title: <span className="process-number">{sequence}</span>,
          dataIndex: `process-${sequence}`,
          width: 100,
          align: "center" as const,
          render: (_, row: TableRow) => {
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

            if (row.rowType === "A") {
              if (!process.actualDate)
                return <span className="empty-cell">-</span>;

              return (
                <span className="actual-date">
                  <CalendarOutlined /> {formatDate(process.actualDate)}
                  {process.workingHours ? ` - ${process.workingHours}` : ""}
                </span>
              );
            }

            return "";
          },
        };
      }),
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 180,
      render: (_, row) => (
        <Space size={8}>
          <Button
            icon={<EditOutlined />}
            className="action-btn"
            onClick={() => handlerUpdate(row.partId)}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa part"
            description={`Bạn có chắc muốn xóa ${row.partName}?`}
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handlerDelete(row.partId)}
          >
            <Button danger icon={<DeleteOutlined />} className="delete-btn">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
      onCell: (row) => ({
        rowSpan: row.rowSpan,
      }),
    },
  ];

  const tabItems: TabsProps["items"] = [
    {
      key: "part",
      label: (
        <Space>
          <AppstoreOutlined />
          Part và kế hoạch gia công
        </Space>
      ),
      children: (
        <Card>
          <div className="d-flex justify-between">
            <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
              <div style={{ width: 200 }}>
                <label className="form-label mb-1">Part Name</label>
                <Input
                  placeholder="Nhập Part Name"
                  allowClear
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
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
                  onChange={(values) => setFilterStatuses(values)}
                  style={{ width: "100%" }}
                  options={[
                    { value: ProcessStatus.Planned, label: "Đã lên kế hoạch" },
                    {
                      value: ProcessStatus.InProgress,
                      label: "Đang thực hiện",
                    },
                    { value: ProcessStatus.Completed, label: "Hoàn thành" },
                    { value: ProcessStatus.Cancelled, label: "Đã hủy" },
                    { value: ProcessStatus.Overdue, label: "Quá hạn" },
                  ]}
                />
              </div>

              <div style={{ width: 270 }}>
                <label className="form-label mb-1">Kế hoạch</label>
                <RangePicker
                  value={filterPlantDateRange}
                  onChange={(dates) => setFilterPlantDateRange(dates)}
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder={["Từ ngày", "Đến ngày"]}
                />
              </div>

              <div style={{ width: 270 }}>
                <label className="form-label mb-1">Thực tế</label>
                <RangePicker
                  value={filterActualDateRange}
                  onChange={(dates) => setFilterActualDateRange(dates)}
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder={["Từ ngày", "Đến ngày"]}
                />
              </div>

              <div className="d-flex gap-2">
                <Button
                  onClick={async () => {
                    setKeyword("");
                    setFilterPlantDateRange([null, null]);
                    setFilterActualDateRange([null, null]);
                    setFilterStatuses([]);
                    await fetchParts();
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>

              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={async () => await fetchParts()}
              >
                Tìm kiếm
              </Button>
            </div>

            <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
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
              total: parts.length,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} part`,
              onChange: (newPage, newPageSize) => {
                setPage(newPage);
                setPageSize(newPageSize);
              },
            }}
          />
        </Card>
      ),
    },
    {
      key: "index",
      label: (
        <Space>
          <CalendarOutlined />
          Danh sách index
        </Space>
      ),
      children: <div>Danh sách index</div>,
    },
  ];

  function handleTabChange(activeKey: string): void {
    switch (activeKey) {
      case "index":
        break;
      case "part":
        fetchParts();
        break;
      default:
        break;
    }
  }
  return (
    <div className="schedule-page">
      <Card>
        <div className="schedule-header">
          <div className="schedule-title-wrap">
            {" "}
            <div className="schedule-icon">
              <ScheduleOutlined />
            </div>
            <div>
              <Title level={3} className="schedule-title">
                Lịch trình gia công chi tiết khuôn
              </Title>
              <Typography.Text type="secondary">
                Theo dõi kế hoạch, thực tế gia công và trạng thái máy theo từng
                part.
              </Typography.Text>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultActiveKey="1" items={tabItems} onChange={handleTabChange} />

      <CreatePart
        open={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          fetchParts();
        }}
      />

      <UpdatePart
        id={selectedId}
        open={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          fetchParts();
        }}
      />
    </div>
  );
}
