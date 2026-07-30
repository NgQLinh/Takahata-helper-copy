"use client";

import {
  AppstoreOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs, { type Dayjs } from "dayjs";
import {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "react-toastify";
type RectangleProps = ComponentProps<typeof Rectangle>;

import {
  searchMachinesReportAsync,
  searchPartProcessReportAsync,
} from "@/app/services/report/ReportService";
import { MachineStatus, PartProcessKPI, type MachineKPI } from "@/app/types";
import { ProcessStatus } from "@/app/types/common/ProcessStatus";

const { RangePicker } = DatePicker;

const WORKING_HOURS_PER_DAY = 8;
const DEFAULT_PAGE_SIZE = 5;
const CHART_COLORS = [
  "#4CAF50",
  "#2196F3",
  "#FFC107",
  "#FF5722",
  "#9C27B0",
  "#00BCD4",
] as const;

const CARD_STYLE = {
  border: "1px solid #e5e7eb",
  boxShadow:
    "0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)",
  background: "#fff",
} as const;

type DateRange = [Dayjs | null, Dayjs | null] | null;

type SummaryCard = {
  title: string;
  value: string;
  color: string;
  icon: ReactNode;
};

const formatHours = (value?: number | null, fractionDigits = 2) =>
  value == null ? "-" : `${value.toFixed(fractionDigits)} giờ`;

const escapeCsvCell = (value: unknown) => {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
};

const getMachineStatusLabel = (status?: MachineStatus) => {
  switch (status) {
    case MachineStatus.Running:
      return "Đang hoạt động";
    case MachineStatus.Maintenance:
      return "Bảo trì";
    case MachineStatus.Stopped:
      return "Dừng";
    default:
      return "Không xác định";
  }
};

export function KpiReportsPage() {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [filterDateRange, setFilterDateRange] = useState<DateRange>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [machinesKPI, setMachinesKPI] = useState<MachineKPI[]>([]);
  const [loadingMachinesReport, setLoadingMachinesReport] = useState(false);

  const [partProcessKPIs, setPartProcessKPIs] = useState<PartProcessKPI[]>([]);
  const [loadingProcessesReport, setLoadingProcessesReport] = useState(false);

  const totalDays = useMemo(() => {
    const [from, to] = filterDateRange ?? [];

    if (!from || !to || to.isBefore(from, "day")) {
      return 0;
    }

    return to.diff(from, "day") + 1;
  }, [filterDateRange]);

  const availableTimePerMachine = totalDays * WORKING_HOURS_PER_DAY;

  const chartData = useMemo(
    () =>
      machinesKPI.map((machine) => {
        const utilization =
          availableTimePerMachine > 0
            ? ((machine.workingTime ?? 0) / availableTimePerMachine) * 100
            : 0;

        return {
          name: machine.name || machine.code || "Chưa đặt tên",
          utilization: Number(
            Math.min(Math.max(utilization, 0), 100).toFixed(1),
          ),
        };
      }),
    [availableTimePerMachine, machinesKPI],
  );

  const fetchMachinesReport = useCallback(async () => {
    const [from, to] = filterDateRange ?? [];

    if (!from || !to) {
      toast.warning("Vui lòng chọn đầy đủ khoảng thời gian.");
      return;
    }

    setLoadingMachinesReport(true);

    try {
      const data = await searchMachinesReportAsync({
        from: from.format("YYYY-MM-DD"),
        to: to.format("YYYY-MM-DD"),
      });

      setMachinesKPI(data.machineKPIs ?? []);
      setPagination((current) => ({ ...current, current: 1 }));
    } catch (error) {
      console.error("Failed to load machine KPI report:", error);
      toast.error("Không thể tải báo cáo KPI máy.");
    } finally {
      setLoadingMachinesReport(false);
    }
  }, [filterDateRange]);

  const fetchPartProcessReport = useCallback(async () => {
    const [from, to] = filterDateRange ?? [];

    if (!from || !to) {
      toast.warning("Vui lòng chọn đầy đủ khoảng thời gian.");
      return;
    }

    try {
      const data = await searchPartProcessReportAsync({
        from: from.format("YYYY-MM-DD"),
        to: to.format("YYYY-MM-DD"),
      });

      if (data.partProcessKPIs) setPartProcessKPIs(data.partProcessKPIs);
    } catch (error) {
      console.error("Failed to load part process KPI report:", error);
      toast.error("Không thể tải báo cáo KPI part process.");
    } finally {
      setLoadingMachinesReport(false);
    }
  }, [filterDateRange]);

  useEffect(() => {
    const run = () => {
      Promise.all([fetchMachinesReport(), fetchPartProcessReport()]);
    };

    void run();
  }, [fetchMachinesReport, fetchPartProcessReport]);

  const machineSummary = useMemo(() => {
    const totalAvailableTime =
      totalDays * WORKING_HOURS_PER_DAY * machinesKPI.length;
    const totalWorkingTime = machinesKPI.reduce(
      (sum, machine) => sum + (machine.workingTime ?? 0),
      0,
    );
    const totalMaintenanceTime = machinesKPI.reduce(
      (sum, machine) => sum + (machine.maintenanceTime ?? 0),
      0,
    );
    const machineUtilization =
      totalAvailableTime > 0
        ? (totalWorkingTime / totalAvailableTime) * 100
        : 0;

    return {
      totalAvailableTime,
      totalWorkingTime,
      totalMaintenanceTime,
      machineUtilization,
    };
  }, [machinesKPI, totalDays]);

  const summaryCards = useMemo<SummaryCard[]>(
    () => [
      {
        title: "Hiệu suất sử dụng",
        value: `${machineSummary.machineUtilization.toFixed(1)}%`,
        color: "#22c55e",
        icon: <DashboardOutlined />,
      },
      {
        title: "Tổng thời gian khả dụng",
        value: `${machineSummary.totalAvailableTime.toFixed(1)} giờ`,
        color: "#3b82f6",
        icon: <ClockCircleOutlined />,
      },
      {
        title: "Tổng thời gian hoạt động",
        value: `${machineSummary.totalWorkingTime.toFixed(1)} giờ`,
        color: "#6366f1",
        icon: <ThunderboltOutlined />,
      },
      {
        title: "Tổng thời gian bảo trì",
        value: `${machineSummary.totalMaintenanceTime.toFixed(1)} giờ`,
        color: "#ef4444",
        icon: <ToolOutlined />,
      },
    ],
    [machineSummary],
  );

  const machineKPIColumns = useMemo<ColumnsType<MachineKPI>>(
    () => [
      {
        title: "Máy",
        dataIndex: "name",
        key: "name",
        fixed: "left",
        width: 220,
        render: (_, record) => (
          <Space>
            <Avatar
              size={28}
              icon={<AppstoreOutlined />}
              style={{ background: "#e8f1ff", color: "#1677ff" }}
            />
            <Typography.Text strong ellipsis={{ tooltip: record.name }}>
              {record.name || record.code || "-"}
            </Typography.Text>
          </Space>
        ),
      },
      {
        title: "Loại máy",
        dataIndex: "type",
        key: "type",
        width: 150,
        render: (value?: string) => value || "-",
      },
      {
        title: "Thời gian hoạt động",
        dataIndex: "workingTime",
        key: "workingTime",
        width: 150,
        align: "right",
        sorter: (a, b) => (a.workingTime ?? 0) - (b.workingTime ?? 0),
        render: (value?: number | null) => formatHours(value),
      },
      {
        title: "Thời gian bảo trì",
        dataIndex: "maintenanceTime",
        key: "maintenanceTime",
        width: 150,
        align: "right",
        sorter: (a, b) => (a.maintenanceTime ?? 0) - (b.maintenanceTime ?? 0),
        render: (value?: number | null) => formatHours(value),
      },
      {
        title: "Trạng thái",
        dataIndex: "machineStatus",
        key: "machineStatus",
        width: 160,
        align: "center",
        filters: [
          { text: "Đang hoạt động", value: MachineStatus.Running },
          { text: "Bảo trì", value: MachineStatus.Maintenance },
          { text: "Dừng", value: MachineStatus.Stopped },
        ],
        onFilter: (value, record) => record.machineStatus === value,
        render: (status?: MachineStatus) => {
          const statusConfig: Partial<
            Record<MachineStatus, { color: string; label: string }>
          > = {
            [MachineStatus.Running]: {
              color: "success",
              label: "Đang hoạt động",
            },
            [MachineStatus.Maintenance]: {
              color: "warning",
              label: "Bảo trì",
            },
            [MachineStatus.Stopped]: { color: "error", label: "Dừng" },
          };
          const config = status == null ? undefined : statusConfig[status];

          return config ? (
            <Tag color={config.color}>{config.label}</Tag>
          ) : (
            <Tag>Không xác định</Tag>
          );
        },
      },
      {
        title: "Hiệu xuất",
        dataIndex: "name",
        key: "name",
        fixed: "right",
        width: 220,
        render: (_, record) => (
          <Space>
            {availableTimePerMachine > 0
              ? (
                  ((record.workingTime ?? 0) / availableTimePerMachine) *
                  100
                ).toFixed(1)
              : "0.00"}
          </Space>
        ),
      },
    ],
    [availableTimePerMachine],
  );

  const partProcessesColumns: ColumnsType<PartProcessKPI> = [
    {
      title: "Part Code",
      dataIndex: "partCode",
      key: "partCode",
      fixed: "left",
    },
    {
      title: "Machine",
      dataIndex: "machineName",
      key: "machineName",
      render: (_, record) => record.machineName ?? record.machineCode ?? "-",
    },
    {
      title: "Machine Code",
      dataIndex: "machineCode",
      key: "machineCode",
    },
    {
      title: "Index",
      dataIndex: "indexCode",
      key: "indexCode",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "right",
    },
    {
      title: "Processed",
      dataIndex: "processedQuantity",
      key: "processedQuantity",
      align: "right",
    },
    {
      title: "Working Time (min)",
      dataIndex: "workingTime",
      key: "workingTime",
      align: "right",
      render: (value?: number) => value?.toFixed(2) ?? "-",
    },
    {
      title: "Setup Time (min)",
      dataIndex: "setupTime",
      key: "setupTime",
      align: "right",
      render: (value?: number) => value?.toFixed(2) ?? "-",
    },
    {
      title: "Waiting Time (min)",
      dataIndex: "waitingTime",
      key: "waitingTime",
      align: "right",
      render: (value?: number) => value?.toFixed(2) ?? "-",
    },
    {
      title: "Plan Date",
      dataIndex: "plantDate",
      key: "plantDate",
      render: (date?: Dayjs) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (date?: Dayjs) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (date?: Dayjs) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: ProcessStatus) => <Tag>{ProcessStatus[status]}</Tag>,
    },
  ];

  return (
    <div
      className="d-flex flex-column"
      style={{ height: "calc(100vh - 20px)" }}
    >
      <div className="grow overflow-auto pe-2">
        <Card className="border-0 shadow-sm">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <Space wrap>
              <RangePicker
                value={filterDateRange}
                onChange={(dates) => setFilterDateRange(dates)}
                format="DD/MM/YYYY"
                placeholder={["Từ ngày", "Đến ngày"]}
                allowClear={false}
              />
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                loading={loadingMachinesReport}
                onClick={() => void fetchMachinesReport()}
              >
                Tải lại
              </Button>
            </Space>
          </div>

          <Row gutter={[12, 12]} align="stretch">
            <Col xs={24} lg={14}>
              <Card
                className="h-100 rounded-4"
                title={
                  <span className="fw-semibold">
                    Hiệu suất sử dụng từng máy
                  </span>
                }
                style={CARD_STYLE}
              >
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={false}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis domain={[0, 100]} unit="%" />
                      <Tooltip
                        formatter={(value) => {
                          const rawValue = Array.isArray(value)
                            ? value[0]
                            : value;
                          const numericValue = Number(rawValue ?? 0);

                          return [
                            `${Number.isFinite(numericValue) ? numericValue.toFixed(1) : "0.0"}%`,
                            "Hiệu suất",
                          ];
                        }}
                      />
                      <Bar
                        dataKey="utilization"
                        shape={(props: RectangleProps & { index?: number }) => {
                          const index = props.index ?? 0;

                          return (
                            <Rectangle
                              {...props}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                              radius={[8, 8, 0, 0]}
                            />
                          );
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Không có dữ liệu trong khoảng thời gian đã chọn"
                  />
                )}
              </Card>
            </Col>

            <Col xs={24} lg={10}>
              <Card
                className="h-100 rounded-4"
                title={<span className="fw-semibold">Tổng quan</span>}
                style={CARD_STYLE}
              >
                <Row gutter={[12, 12]}>
                  {summaryCards.map((item) => (
                    <Col xs={24} sm={12} key={item.title}>
                      <div
                        className="h-100 rounded-4 p-3"
                        style={{
                          border: "1px solid #edf2f7",
                          borderLeft: `5px solid ${item.color}`,
                          background: "#fff",
                        }}
                      >
                        <div
                          className="mb-3 d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: 42,
                            height: 42,
                            background: `${item.color}15`,
                            color: item.color,
                            fontSize: 18,
                          }}
                        >
                          {item.icon}
                        </div>
                        <Typography.Text type="secondary">
                          {item.title}
                        </Typography.Text>
                        <div
                          className="mt-1 fw-bold"
                          style={{ fontSize: 24, color: item.color }}
                        >
                          {item.value}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>

          <Card
            className="dashboard-card mt-3"
            title={
              <div className="d-flex flex-row justify-between">
                <span className="fw-semibold">Danh sách KPI máy</span>

                <Button
                  icon={<DownloadOutlined />}
                  disabled={machinesKPI.length === 0}
                >
                  Xuất báo cáo
                </Button>
              </div>
            }
          >
            <Table<MachineKPI>
              rowKey={(record) => record.code ?? record.name}
              columns={machineKPIColumns}
              dataSource={machinesKPI}
              loading={loadingMachinesReport}
              size="middle"
              className="dashboard-table"
              scroll={{ x: 1150 }}
              locale={{ emptyText: "Không có dữ liệu KPI máy" }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: machinesKPI.length,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: [5, 10, 20, 50],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} / ${total} máy`,
                onChange: (current, pageSize) =>
                  setPagination({ current, pageSize }),
              }}
            />
          </Card>

          <Card
            className="dashboard-card mt-3"
            title={
              <div className="d-flex flex-row justify-between">
                <span className="fw-semibold">Danh sách KPI máy</span>

                <Button
                  icon={<DownloadOutlined />}
                  disabled={machinesKPI.length === 0}
                >
                  Xuất báo cáo
                </Button>
              </div>
            }
          >
            <Table<PartProcessKPI>
              rowKey="partProcessId"
              loading={loadingProcessesReport}
              columns={partProcessesColumns}
              dataSource={partProcessKPIs}
              bordered
              size="small"
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
              }}
              scroll={{ x: 1600 }}
            />
          </Card>
        </Card>
      </div>
    </div>
  );
}
