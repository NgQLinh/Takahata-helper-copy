"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import { getMachinesAsync } from "@/app/services/machine/MachineService";
import { toast } from "react-toastify";
import { DeleteMachineRequest, Machine } from "@/app/types";
import type { ColumnsType } from "antd/es/table";
import {
  Avatar,
  Button,
  Card,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  Tabs,
  TabsProps,
  Select,
  DatePicker,
} from "antd";

import {
  AppstoreOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { deleteMachineAsync } from "@/app/services/machine/MachineService";
import CreateMachine from "./CreateMachine";
import { ColumnFilterItem } from "antd/es/table/interface";
import UpdateMachine from "./UpdateMachine";
import MachineDetail from "./MachineDetail";

import "./MachinesPage.css";

const { Title, Text } = Typography;
const { Search } = Input;
export function MachinesPage() {
  const [loading, setLoading] = useState(true);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);

  const typeFilter = useMemo<ColumnFilterItem[]>(
    () =>
      Array.from(new Set(machines.map((m) => m.type))).map((type) => ({
        text: type,
        value: type,
      })),
    [machines],
  );

  const brandFilter = useMemo<ColumnFilterItem[]>(
    () =>
      Array.from(new Set(machines.map((m) => m.brand))).map((brand) => ({
        text: brand,
        value: brand,
      })),
    [machines],
  );

  const createByFilter = useMemo<ColumnFilterItem[]>(
    () =>
      Array.from(new Set(machines.map((m) => m.createBy))).map((createBy) => ({
        text: createBy,
        value: createBy,
      })),
    [machines],
  );

  const updateByFilter = useMemo<ColumnFilterItem[]>(
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
      const keyword = searchText.toLowerCase();

      return (
        machine.name.toLowerCase().includes(keyword) ||
        machine.code.toLowerCase().includes(keyword)
      );
    });
  }, [machines, searchText]);

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

  const handleCreate = async () => {
    fetchMachines();
  };

  const handleUpdate = async () => {
    setEditingMachine(null);
    fetchMachines();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = async (id: number) => {
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

  const columns: ColumnsType<Machine> = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "sequenceNumber",
        width: 70,
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
        filters: typeFilter,
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
        filters: brandFilter,
        onFilter: (value, record) => record.brand === value,
      },
      {
        title: "Người tạo",
        dataIndex: "createBy",
        width: 130,
        filters: createByFilter,
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
        width: 150,
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
        filters: updateByFilter,
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
        width: 160,
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
              onConfirm={() => handleDelete(record.id)}
            >
              <Button danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [typeFilter, brandFilter, createByFilter, updateByFilter, handleDelete],
  );

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
            <Search
              placeholder="Tìm theo tên máy hoặc mã máy trong trang"
              allowClear
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 420 }}
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateOpen(true)}
            >
              Thêm máy
            </Button>
          </div>

          <Table<Machine>
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={filteredMachines}
            scroll={{ x: 1350, y: "calc(100vh - 500px)" }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} máy`,
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
        <>
          <div className="maintenance-filter">
            <Select placeholder="Chọn máy" style={{ width: 220 }} />
            <Select placeholder="Loại bảo dưỡng" style={{ width: 220 }} />
            <DatePicker placeholder="Từ ngày" />
            <DatePicker placeholder="Đến ngày" />
            <Button>Lọc</Button>
          </div>
        </>
      ),
    },
  ];

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

      <Tabs defaultActiveKey="1" items={tabItems} />

      <CreateMachine
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />

      <UpdateMachine
        open={!!editingMachine}
        machine={editingMachine}
        onClose={() => setEditingMachine(null)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
