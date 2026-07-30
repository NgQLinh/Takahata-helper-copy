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

import { searchMachinesReportAsync } from "@/app/services/report/ReportService";
import { MachineStatus, type MachineKPI } from "@/app/types";

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

  useEffect(() => {
    const run = () => {
      void fetchMachinesReport();
    };

    void run();
  }, [fetchMachinesReport]);

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
        title: "Mã máy",
        dataIndex: "code",
        key: "code",
        width: 140,
        render: (value?: string) => value || "-",
      },
      {
        title: "Loại máy",
        dataIndex: "type",
        key: "type",
        width: 150,
        render: (value?: string) => value || "-",
      },
      {
        title: "Hãng",
        dataIndex: "brand",
        key: "brand",
        width: 150,
        render: (value?: string) => value || "-",
      },
      {
        title: "Thời gian hoạt động",
        dataIndex: "workingTime",
        key: "workingTime",
        width: 180,
        align: "right",
        sorter: (a, b) => (a.workingTime ?? 0) - (b.workingTime ?? 0),
        render: (value?: number | null) => formatHours(value),
      },
      {
        title: "Thời gian bảo trì",
        dataIndex: "maintenanceTime",
        key: "maintenanceTime",
        width: 180,
        align: "right",
        sorter: (a, b) => (a.maintenanceTime ?? 0) - (b.maintenanceTime ?? 0),
        render: (value?: number | null) => formatHours(value),
      },
      {
        title: "Trạng thái",
        dataIndex: "machineStatus",
        key: "machineStatus",
        width: 160,
        fixed: "right",
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
    ],
    [],
  );

  const handleExportCsv = useCallback(() => {
    if (machinesKPI.length === 0) {
      toast.info("Không có dữ liệu để xuất báo cáo.");
      return;
    }

    const headers = [
      "Tên máy",
      "Mã máy",
      "Loại máy",
      "Hãng",
      "Thời gian hoạt động (giờ)",
      "Thời gian bảo trì (giờ)",
      "Trạng thái",
    ];
    const rows = machinesKPI.map((machine) => [
      machine.name ?? "",
      machine.code ?? "",
      machine.type ?? "",
      machine.brand ?? "",
      machine.workingTime ?? 0,
      machine.maintenanceTime ?? 0,
      getMachineStatusLabel(machine.machineStatus),
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsvCell).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const [from, to] = filterDateRange ?? [];

    anchor.href = url;
    anchor.download = `machine-kpi-${from?.format("YYYYMMDD") ?? "from"}-${to?.format("YYYYMMDD") ?? "to"}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }, [filterDateRange, machinesKPI]);

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
        </Card>
      </div>
    </div>
  );
}
