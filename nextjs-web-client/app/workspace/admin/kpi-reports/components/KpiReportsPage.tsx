"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { MachineKPI, MachineStatus } from "@/app/types";
import { toast } from "react-toastify";
import { searchMachinesReportAsync } from "@/app/services/report/ReportService";
import Table, { ColumnsType } from "antd/es/table";
import {
  AppstoreOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  ToolOutlined,
} from "@ant-design/icons";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = [
  "#4CAF50",
  "#2196F3",
  "#FFC107",
  "#FF5722",
  "#9C27B0",
  "#00BCD4",
];

const { RangePicker } = DatePicker;
type DateRange = [Dayjs | null, Dayjs | null] | null;

export function KpiReportsPage() {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const [filterDateRange, setFilterDateRange] = useState<DateRange>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const [machinesKPI, setMachinesKPI] = useState<MachineKPI[]>([]);
  const [loadingMachinesReport, setLoadingMachinesReport] = useState(false);

  const totalDays =
    filterDateRange?.[0] && filterDateRange?.[1]
      ? filterDateRange[1].diff(filterDateRange[0], "day") + 1
      : 0;

  const availableTimePerMachine = totalDays * 8;

  const chartData = machinesKPI.map((item) => ({
    name: item.name,
    utilization:
      availableTimePerMachine > 0 && item.workingTime
        ? Number(
            ((item.workingTime / availableTimePerMachine) * 100).toFixed(1),
          )
        : 0,
  }));

  const fetchMachinesReport = useCallback(async () => {
    setLoadingMachinesReport(true);

    try {
      const request = {
        from: filterDateRange?.[0]
          ? filterDateRange[0].format("YYYY-MM-DD")
          : null,
        to: filterDateRange?.[1]
          ? filterDateRange[1].format("YYYY-MM-DD")
          : null,
      };

      const data = await searchMachinesReportAsync(request);

      console.log(data.machineKPIs);

      if (data.machineKPIs) setMachinesKPI(data.machineKPIs);
    } catch (error) {
      console.log(error);
      toast.error("Không thể tải machines report.");
    } finally {
      setLoadingMachinesReport(false);
    }
  }, [filterDateRange]);

  useEffect(() => {
    const run = async () => {
      await Promise.all([fetchMachinesReport()]);
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const machineSummary = useMemo(() => {
    if (!filterDateRange)
      return {
        totalAvailableTime: 0,
        totalWorkingTime: 0,
        totalMaintenanceTime: 0,
        machineUtilization: 0,
      };

    if (!filterDateRange[0] || !filterDateRange[1]) {
      return {
        totalAvailableTime: 0,
        totalWorkingTime: 0,
        totalMaintenanceTime: 0,
        machineUtilization: 0,
      };
    }

    const totalDays = filterDateRange[1].diff(filterDateRange[0], "day") + 1;

    const machineCount = machinesKPI?.length ?? 0;

    const totalAvailableTime = totalDays * 8 * machineCount;

    const totalWorkingTime =
      machinesKPI?.reduce(
        (sum, machine) => sum + (machine.workingTime ?? 0),
        0,
      ) ?? 0;

    const totalMaintenanceTime =
      machinesKPI?.reduce(
        (sum, machine) => sum + (machine.maintenanceTime ?? 0),
        0,
      ) ?? 0;

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
  }, [filterDateRange, machinesKPI]);

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
              style={{
                background: "#e8f1ff",
                color: "#1677ff",
              }}
            />
            <Typography.Text strong>
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
      },
      {
        title: "Loại máy",
        dataIndex: "type",
        key: "type",
        width: 150,
        render: (value: string) => value || "-",
      },
      {
        title: "Hãng",
        dataIndex: "brand",
        key: "brand",
        width: 150,
        render: (value: string) => value || "-",
      },
      {
        title: "Thời gian hoạt động",
        dataIndex: "workingTime",
        key: "workingTime",
        width: 180,
        align: "right",
        render: (value: number | null) =>
          value != null ? `${value.toFixed(2)} giờ` : "-",
      },
      {
        title: "Thời gian bảo trì",
        dataIndex: "maintenanceTime",
        key: "maintenanceTime",
        width: 180,
        align: "right",
        render: (value: number | null) =>
          value != null ? `${value.toFixed(2)} giờ` : "-",
      },
      {
        title: "Trạng thái",
        dataIndex: "machineStatus",
        key: "machineStatus",
        width: 150,
        align: "center",
        render: (status: MachineStatus) => {
          switch (status) {
            case MachineStatus.Running:
              return <Tag color="success">Đang hoạt động</Tag>;

            case MachineStatus.Maintenance:
              return <Tag color="warning">Bảo trì</Tag>;

            case MachineStatus.Stopped:
              return <Tag color="error">Dừng</Tag>;

            default:
              return <Tag>-</Tag>;
          }
        },
      },
    ],
    [],
  );
  return (
    <div>
      <div
        className="container-fluid py-3 d-flex flex-column"
        style={{ height: "calc(100vh - 20px)" }}
      >
        <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
          <div style={{ width: 270 }}>
            <label className="form-label mb-1">Kế hoạch</label>
            <RangePicker
              value={filterDateRange}
              onChange={setFilterDateRange}
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </div>

          <Button
            onClick={async () => {
              await fetchMachinesReport();
            }}
            type="primary"
          >
            Tải lại
          </Button>
        </div>

        <div className="grow overflow-auto pe-2">
          <Card className="shadow-sm border-0">
            {/* Báo cáo máy */}
            <div>
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Máy</h4>
                  <small className="text-muted">Dashboard hiệu suất máy</small>
                </div>

                <Button>Export report</Button>
              </div>

              {/* Biểu đồ & KPI*/}
              <div className="row g-2">
                {/* Chart */}
                <div className="col-lg-7">
                  <Card
                    className="h-100 rounded-4"
                    title={
                      <span className="fw-semibold">
                        Hiệu xuất sử dụng từng máy
                      </span>
                    }
                    style={{
                      border: "1px solid #e5e7eb",
                      boxShadow:
                        "0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)",
                      transition: "all .3s ease",
                      background: "#fff",
                    }}
                  >
                    <div className="card-body">
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart
                          data={chartData}
                          margin={{
                            top: 10,
                            right: 20,
                            left: 0,
                            bottom: 10,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />

                          <XAxis dataKey="name" />

                          <YAxis domain={[0, 100]} unit="%" />

                          <Tooltip
                            formatter={(value) => [`${value}%`, "Hiệu suất"]}
                          />

                          <Bar dataKey="utilization" radius={[8, 8, 0, 0]}>
                            {chartData.map((_, index) => (
                              <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>

                {/* KPI */}
                <div className="col-lg-5">
                  <Card
                    className="h-100 rounded-4"
                    title={<span className="fw-semibold">Tổng quan</span>}
                    style={{
                      border: "1px solid #e5e7eb",
                      boxShadow:
                        "0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)",
                      transition: "all .3s ease",
                      background: "#fff",
                    }}
                  >
                    <Row gutter={[12, 12]}>
                      {[
                        {
                          title: "Hiệu suất",
                          value: `${machineSummary.machineUtilization.toFixed(1)}%`,
                          color: "#22c55e",
                          icon: <DashboardOutlined />,
                        },
                        {
                          title: "Thời gian hoạt động",
                          value: `${machineSummary.totalAvailableTime.toFixed(1)}h`,
                          color: "#3b82f6",
                          icon: <ClockCircleOutlined />,
                        },
                        {
                          title: "Máy chạy",
                          value: `${machineSummary.totalWorkingTime.toFixed(1)}h`,
                          color: "#6366F1",
                          icon: <ThunderboltOutlined />,
                        },
                        {
                          title: "Bảo trì",
                          value: `${machineSummary.totalMaintenanceTime.toFixed(1)}h`,
                          color: "#ef4444",
                          icon: <ToolOutlined />,
                        },
                      ].map((item) => (
                        <Col span={12} key={item.title}>
                          <div
                            className="rounded-4 p-3 h-100"
                            style={{
                              border: "1px solid #edf2f7",
                              borderLeft: `5px solid ${item.color}`,
                              background: "#fff",
                            }}
                          >
                            <div className="d-flex align-items-center mb-3">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center"
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
                            </div>

                            <div className="text-secondary small">
                              {item.title}
                            </div>

                            <div
                              className="fw-bold mt-1"
                              style={{
                                fontSize: 28,
                                color: item.color,
                              }}
                            >
                              {item.value}
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                </div>
              </div>

              <Card
                className="dashboard-card mt-3"
                title={<span className="fw-semibold">Danh sách KPI máy</span>}
              >
                <Table<MachineKPI>
                  rowKey="id"
                  columns={machineKPIColumns}
                  dataSource={machinesKPI}
                  loading={loadingMachinesReport}
                  size="middle"
                  className="dashboard-table"
                  pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: machinesKPI.length,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} / ${total} máy`,
                    onChange: (page, pageSize) => {
                      setPagination({
                        current: page,
                        pageSize,
                      });
                    },
                  }}
                />
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
