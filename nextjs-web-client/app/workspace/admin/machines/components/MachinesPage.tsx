"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  deleteMachineMaintenanceProcessAsync,
  getMachinesAsync,
  searchMachineMaintenanceProcess,
} from "@/app/services/machine/MachineService";
import { toast } from "react-toastify";
import { DeleteMachineRequest, Machine } from "@/app/types";
import type { ColumnsType } from "antd/es/table";
import {
  Avatar,
  Button,
  Card,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  Tabs,
  TabsProps,
  DatePicker,
  Select,
} from "antd";

import {
  AppstoreOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { deleteMachineAsync } from "@/app/services/machine/MachineService";
import CreateMachine from "./CreateMachine";
import { ColumnFilterItem } from "antd/es/table/interface";
import UpdateMachine from "./UpdateMachine";

import "./MachinesPage.css";
import CreateMachineMaintenanceProcess from "./CreateMachineMaintenanceProcess";
import { MachineMaintenanceProcess } from "@/app/types/machine/MachineMaintenanceProcess";
import { ProcessStatus } from "@/app/types/common/ProcessStatus";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
export function MachinesPage() {
  // Common state
  const [loading, setLoading] = useState(true);

  // Machine state
  const [machinePageSize, setMachinePageSize] = useState(100);
  const [machinePage, setMachinePage] = useState(1);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isCreateMachineOpen, setIsCreateMachineOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);

  // MachineMaintenanceProcess state
  const [createMaintenanceProcessOpen, setCreateMaintenanceProcessOpen] =
    useState(false);
  const [filterStatuses, setFilterStatuses] = useState<ProcessStatus[]>([]);
  const [filterMachineIds, setFilterMachineIds] = useState<number[]>([]);
  const [filterDateRange, setFilterDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >([dayjs().startOf("month"), dayjs().endOf("month")]);
  const [pageMaintenanceProcess, setPageMaintenanceProcess] = useState(1);
  const [pageSizeMaintenanceProcess, setPageSizeMaintenanceProcess] =
    useState(100);
  const [totalItemsMaintenanceProcess, setTotalItemsMaintenanceProcess] =
    useState(0);
  const [maintenanceProcesses, setMaintenanceProcesses] = useState<
    MachineMaintenanceProcess[]
  >([]);

  const handleSearchMachineMaintenanceProcess = async (
    currentPage = pageMaintenanceProcess,
    currentPageSize = pageSizeMaintenanceProcess,
  ) => {
    setLoading(true);

    try {
      const result = await searchMachineMaintenanceProcess({
        machineIds: filterMachineIds,
        statuses: filterStatuses,
        from: filterDateRange?.[0]
          ? filterDateRange[0].format("YYYY-MM-DD")
          : null,
        to: filterDateRange?.[1]
          ? filterDateRange[1].format("YYYY-MM-DD")
          : null,
        page: currentPage,
        pageSize: currentPageSize,
      });

      setMaintenanceProcesses(result.data);
      setPageMaintenanceProcess(result.page);
      setPageSizeMaintenanceProcess(result.pageSize);
      setTotalItemsMaintenanceProcess(result.totalItems);
    } finally {
      setLoading(false);
    }
  };

  // Machine filters
  const typeMachineFilter = useMemo<ColumnFilterItem[]>(
    () =>
      Array.from(new Set(machines.map((m) => m.type))).map((type) => ({
        text: type,
        value: type,
      })),
    [machines],
  );

  const brandMachineFilter = useMemo<ColumnFilterItem[]>(
    () =>
      Array.from(new Set(machines.map((m) => m.brand))).map((brand) => ({
        text: brand,
        value: brand,
      })),
    [machines],
  );

  const createByMachineFilter = useMemo<ColumnFilterItem[]>(
    () =>
      Array.from(new Set(machines.map((m) => m.createBy))).map((createBy) => ({
        text: createBy,
        value: createBy,
      })),
    [machines],
  );

  const updateByMachineFilter = useMemo<ColumnFilterItem[]>(
    () =>
      Array.from(
        new Set(
          machines
            .map((m) => m.updateBy)
            .filter((updateBy): updateBy is string => !!updateBy),
        ),
      ).map((updateBy) => ({
        text: updateBy,
        value: updateBy,
      })),
    [machines],
  );

  const filteredMachines = useMemo(() => {
    return machines.filter((machine) => {
      return machine.name.toLowerCase() || machine.code.toLowerCase();
    });
  }, [machines]);

  const fetchMachines = useCallback(async () => {
    setLoading(true);
    getMachinesAsync()
      .then((data) => {
        setMachines(data);
      })
      .catch((error) => {
        console.error("Tạo tài khoản không thành công:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getMachinesAsync()
      .then((data) => {
        setMachines(data);
      })
      .catch((error) => {
        console.error("Lỗi khi call API:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCreateMachine = async () => {
    fetchMachines();
  };

  const handleUpdateMachine = async () => {
    setEditingMachine(null);
    fetchMachines();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDeleteMachine = async (id: number) => {
    const request: DeleteMachineRequest = {
      id: id,
    };

    await deleteMachineAsync(request)
      .then((data) => {
        console.log(data);
        fetchMachines();
        toast.success("Xóa máy thành công");
      })
      .catch((error) => {
        toast.error("Xóa máy không thành công");
        console.error("Xóa máy không thành công:", error);
      });
  };

  const handleDeleteMachineMaintenanceProcess = async (id: number) => {
    const request: DeleteMachineRequest = {
      id: id,
    };

    await deleteMachineMaintenanceProcessAsync(request)
      .then((data) => {
        console.log(data);
        toast.success("Xóa máy thành công");
        handleSearchMachineMaintenanceProcess();
      })
      .catch((error) => {
        toast.error("Xóa máy không thành công");
        console.error("Xóa máy không thành công:", error);
      });
  };

  const machineColumns: ColumnsType<Machine> = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "sequenceNumber",
        width: 100,
        fixed: "left",
        sorter: (a, b) => a.sequenceNumber - b.sequenceNumber,
        render: (value) => <Text strong>{value}</Text>,
      },
      {
        title: "Tên máy",
        dataIndex: "name",
        width: 150,
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (value) => (
          <Space>
            <Avatar
              size={28}
              icon={<AppstoreOutlined />}
              style={{ background: "#e8f1ff", color: "#1677ff" }}
            />
            <Text strong>{value}</Text>
          </Space>
        ),
      },
      {
        title: "Mã máy",
        dataIndex: "code",
        width: 120,
        sorter: (a, b) => a.code.localeCompare(b.code),
        render: (value) => <Tag color="blue">{value}</Tag>,
      },
      {
        title: "Loại máy",
        dataIndex: "type",
        width: 170,
        filters: typeMachineFilter,
        onFilter: (value, record) => record.type === value,
        render: (value) => (
          <Tag
            icon={<ToolOutlined />}
            color={value === "NC Milling" ? "gold" : "green"}
          >
            {value}
          </Tag>
        ),
      },
      {
        title: "Thương hiệu",
        dataIndex: "brand",
        width: 130,
        filters: brandMachineFilter,
        onFilter: (value, record) => record.brand === value,
      },
      {
        title: "Người tạo",
        dataIndex: "createBy",
        width: 130,
        filters: createByMachineFilter,
        onFilter: (value, record) => record.createBy === value,
        render: (value) => (
          <Space>
            <Avatar
              size={28}
              style={{ background: "#dbeafe", color: "#1677ff" }}
            >
              {value?.[0]?.toUpperCase() || "A"}
            </Avatar>
            {value}
          </Space>
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createAt",
        width: 200,
        sorter: (a, b) =>
          dayjs(a.createAt).valueOf() - dayjs(b.createAt).valueOf(),
        render: (value) => (
          <Space>
            <CalendarOutlined style={{ color: "#64748b" }} />
            <span>{dayjs(value).format("HH:mm:ss DD/MM/YYYY")}</span>
          </Space>
        ),
      },
      {
        title: "Người sửa",
        dataIndex: "updateBy",
        width: 130,
        filters: updateByMachineFilter,
        onFilter: (value, record) => record.updateBy === value,
        render: (value) =>
          value ? (
            <Space>
              <Avatar
                size={28}
                style={{ background: "#dbeafe", color: "#1677ff" }}
              >
                {value?.[0]?.toUpperCase() || "A"}
              </Avatar>
              {value}
            </Space>
          ) : (
            <Text type="secondary">-</Text>
          ),
      },
      {
        title: "Ngày sửa",
        dataIndex: "updateAt",
        width: 200,
        sorter: (a, b) =>
          dayjs(a.updateAt).valueOf() - dayjs(b.updateAt).valueOf(),
        render: (value) =>
          value ? (
            <Space>
              <CalendarOutlined style={{ color: "#64748b" }} />
              <span>{dayjs(value).format("DD/MM/YYYY HH:mm:ss")}</span>
            </Space>
          ) : (
            <Text type="secondary">-</Text>
          ),
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 200,
        fixed: "right",
        align: "center",
        render: (_, record) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => setEditingMachine(record)}
            >
              Sửa
            </Button>

            <Popconfirm
              title="Xóa máy"
              description={`Bạn có chắc muốn xóa ${record.name}?`}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => handleDeleteMachine(record.id)}
            >
              <Button danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [
      typeMachineFilter,
      brandMachineFilter,
      createByMachineFilter,
      updateByMachineFilter,
      handleDeleteMachine,
    ],
  );

  const maintenanceProcessColumns: ColumnsType<MachineMaintenanceProcess> = [
    {
      title: "STT",
      fixed: "left",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: 80,
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: "Máy",
      dataIndex: "machine",
      width: 150,
      render: (value) => (
        <Space>
          <Avatar
            size={28}
            icon={<AppstoreOutlined />}
            style={{ background: "#e8f1ff", color: "#1677ff" }}
          />
          <Text strong>{value?.name || value?.code}</Text>
        </Space>
      ),
    },
    {
      title: "Ngày kế hoạch",
      dataIndex: "planDate",
      width: 150,
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : ""),
    },
    {
      title: "Ngày thực tế",
      dataIndex: "actualDate",
      width: 150,
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : ""),
    },
    {
      title: "Giờ làm",
      width: 100,
      dataIndex: "workingHours",
      render: (value) => Number(value).toFixed(2),
    },
    {
      title: "Người thực hiện",
      width: 150,
      dataIndex: "performedBy",
    },
    {
      title: "Trạng thái",
      width: 150,
      dataIndex: "status",
      render: (status: ProcessStatus) => {
        switch (status) {
          case ProcessStatus.Planned:
            return <Tag color="blue">Đã lên kế hoạch</Tag>;

          case ProcessStatus.InProgress:
            return <Tag color="processing">Đang thực hiện</Tag>;

          case ProcessStatus.Completed:
            return <Tag color="success">Hoàn thành</Tag>;

          case ProcessStatus.Cancelled:
            return <Tag color="default">Đã hủy</Tag>;

          case ProcessStatus.Overdue:
            return <Tag color="error">Quá hạn</Tag>;

          default:
            return <Tag>Không xác định</Tag>;
        }
      },
    },
    {
      title: "Ghi chú",
      width: 200,
      dataIndex: "note",
    },
    {
      title: "Người tạo",
      dataIndex: "createBy",
      width: 120,
      render: (value) => (
        <Space>
          <Avatar size={28} style={{ background: "#dbeafe", color: "#1677ff" }}>
            {value?.[0]?.toUpperCase() || "A"}
          </Avatar>
          {value}
        </Space>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      width: 200,
      sorter: (a, b) =>
        dayjs(a.createAt).valueOf() - dayjs(b.createAt).valueOf(),
      render: (value) => (
        <Space>
          <CalendarOutlined style={{ color: "#64748b" }} />
          <span>{dayjs(value).format("HH:mm:ss DD/MM/YYYY")}</span>
        </Space>
      ),
    },
    {
      title: "Người sửa",
      dataIndex: "updateBy",
      width: 120,
      render: (value) =>
        value ? (
          <Space>
            <Avatar
              size={28}
              style={{ background: "#dbeafe", color: "#1677ff" }}
            >
              {value?.[0]?.toUpperCase() || "A"}
            </Avatar>
            {value}
          </Space>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: "Ngày sửa",
      dataIndex: "updateAt",
      width: 200,
      sorter: (a, b) =>
        dayjs(a.updateAt).valueOf() - dayjs(b.updateAt).valueOf(),
      render: (value) =>
        value ? (
          <Space>
            <CalendarOutlined style={{ color: "#64748b" }} />
            <span>{dayjs(value).format("DD/MM/YYYY HH:mm:ss")}</span>
          </Space>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />}>Sửa</Button>

          <Popconfirm
            title="Xóa lịch bảo dưỡng"
            description={`Bạn có chắc muốn xóa?`}
            okText="Xóa"
            onConfirm={() => handleDeleteMachineMaintenanceProcess(record.id)}
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems: TabsProps["items"] = [
    {
      key: "machines",
      label: (
        <Space>
          <AppstoreOutlined />
          Danh sách máy
        </Space>
      ),
      children: (
        <Card className="machine-card">
          <div className="machine-toolbar d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2 flex-wrap" />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateMachineOpen(true)}
            >
              Thêm máy
            </Button>
          </div>

          <Table<Machine>
            rowKey="id"
            loading={loading}
            columns={machineColumns}
            dataSource={filteredMachines}
            scroll={{
              x: "max-content",
              y: "calc(100vh - 450px)",
            }}
            pagination={{
              current: machinePage,
              pageSize: machinePageSize,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} máy`,
              onChange: (page, pageSize) => {
                setMachinePage(page);
                setMachinePageSize(pageSize);
              },
            }}
          />
        </Card>
      ),
    },
    {
      key: "maintenance-history",
      label: (
        <Space>
          <CalendarOutlined />
          Lịch sử bảo dưỡng
        </Space>
      ),
      children: (
        <Card className="machine-card">
          <div className="machine-toolbar d-flex justify-content-between align-items-center gap-2 mb-3">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder="Chọn máy"
                style={{ width: 320 }}
                value={filterMachineIds}
                onChange={(values) => setFilterMachineIds(values)}
                options={machines.map((machine) => ({
                  value: machine.id,
                  label: `${machine.name} - ${machine.code}`,
                }))}
                maxTagCount="responsive"
              />

              <Select
                mode="multiple"
                allowClear
                placeholder="Trạng thái"
                style={{ width: 260 }}
                value={filterStatuses}
                onChange={(values) => setFilterStatuses(values)}
                options={[
                  { value: ProcessStatus.Planned, label: "Đã Lên kế hoạch" },
                  { value: ProcessStatus.InProgress, label: "Đang thực hiện" },
                  { value: ProcessStatus.Completed, label: "Hoàn thành" },
                  { value: ProcessStatus.Cancelled, label: "Đã hủy" },
                  { value: ProcessStatus.Overdue, label: "Quá hạn" },
                ]}
              />

              <RangePicker
                format="DD/MM/YYYY"
                value={filterDateRange}
                onChange={(dates) => setFilterDateRange(dates)}
                placeholder={["Từ ngày", "Đến ngày"]}
              />

              <Button
                onClick={async () => {
                  setFilterMachineIds([]);
                  setFilterDateRange([null, null]);
                  setFilterStatuses([]);
                  handleSearchMachineMaintenanceProcess();
                }}
              >
                Xóa bộ lọc
              </Button>

              <Button
                type="primary"
                onClick={() => {
                  handleSearchMachineMaintenanceProcess();
                }}
              >
                Tìm kiếm
              </Button>
            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateMaintenanceProcessOpen(true)}
            >
              Thêm lịch bảo dưỡng
            </Button>
          </div>

          <Table<MachineMaintenanceProcess>
            rowKey="id"
            columns={maintenanceProcessColumns}
            dataSource={maintenanceProcesses}
            loading={loading}
            scroll={{
              x: "max-content",
              y: "calc(100vh - 450px)",
            }}
            pagination={{
              current: pageMaintenanceProcess,
              pageSize: pageSizeMaintenanceProcess,
              total: totalItemsMaintenanceProcess,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} bản ghi`,
              onChange: (newPage, newPageSize) => {
                handleSearchMachineMaintenanceProcess(newPage, newPageSize);
              },
            }}
          />
        </Card>
      ),
    },
  ];

  function handleTabChange(activeKey: string): void {
    if (activeKey === "maintenance-history") {
      handleSearchMachineMaintenanceProcess();
    } else if (activeKey === "machines") {
      fetchMachines();
    }
  }

  return (
    <div>
      <Card>
        <div className="machine-header">
          <div className="machine-title-wrap">
            <div className="machine-icon">
              <AppstoreOutlined />
            </div>
            <div>
              <Title level={3} className="machine-title">
                Quản lý danh sách máy
              </Title>
              <Text type="secondary">
                Quản lý và theo dõi danh sách máy trong hệ thống.
              </Text>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultActiveKey="1" items={tabItems} onChange={handleTabChange} />

      <CreateMachine
        open={isCreateMachineOpen}
        onClose={() => setIsCreateMachineOpen(false)}
        onCreate={handleCreateMachine}
      />

      <UpdateMachine
        open={!!editingMachine}
        machine={editingMachine}
        onClose={() => setEditingMachine(null)}
        onUpdate={handleUpdateMachine}
      />

      <CreateMachineMaintenanceProcess
        open={createMaintenanceProcessOpen}
        onClose={() => {
          setCreateMaintenanceProcessOpen(false);
          handleSearchMachineMaintenanceProcess();
        }}
      />
    </div>
  );
}
