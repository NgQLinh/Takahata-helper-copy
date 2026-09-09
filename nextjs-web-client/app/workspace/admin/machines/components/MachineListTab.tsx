"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  AppstoreOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  ToolOutlined,
  UserOutlined,
} from "@ant-design/icons";
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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ColumnFilterItem } from "antd/es/table/interface";
import { toast } from "react-toastify";

import {
  deleteMachineAsync,
  searchMachinesAsync,
} from "@/app/services/machine/MachineService";
import type { DeleteMachineRequest, Machine } from "@/app/types";

import CreateMachine from "./CreateMachine";
import UpdateMachine from "./UpdateMachine";

const { Text } = Typography;

interface Props {
  active: boolean;
}

export default function MachineListTab({ active }: Props) {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [machinePage, setMachinePage] = useState(1);
  const [machinePageSize, setMachinePageSize] = useState(100);
  const [totalMachines, setTotalMachines] = useState(0);

  const [machines, setMachines] = useState<Machine[]>([]);
  const [isCreateMachineOpen, setIsCreateMachineOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);

  const fetchMachines = useCallback(
    async (
      page = machinePage,
      pageSize = machinePageSize,
      keyword = searchText,
    ) => {
      setLoading(true);

      try {
        const result = await searchMachinesAsync({
          keyword: keyword.trim(),
          page,
          pageSize,
        });

        setMachines(result.data);
        setMachinePage(result.page ?? page);
        setMachinePageSize(result.pageSize ?? pageSize);
        setTotalMachines(result.totalItems ?? result.data.length);
      } catch (error) {
        console.error("Không thể tải danh sách máy:", error);
        toast.error("Không thể tải danh sách máy");
      } finally {
        setLoading(false);
      }
    },
    [machinePage, machinePageSize, searchText],
  );

  useEffect(() => {
    const run = () => {
      void fetchMachines();
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const typeMachineFilter = useMemo<ColumnFilterItem[]>(
    () =>
      Array.from(new Set(machines.map((machine) => machine.type)))
        .filter(Boolean)
        .map((type) => ({
          text: type,
          value: type,
        })),
    [machines],
  );

  const brandMachineFilter = useMemo<ColumnFilterItem[]>(
    () =>
      Array.from(new Set(machines.map((machine) => machine.brand)))
        .filter(Boolean)
        .map((brand) => ({
          text: brand,
          value: brand,
        })),
    [machines],
  );

  const createByMachineFilter = useMemo<ColumnFilterItem[]>(
    () =>
      Array.from(new Set(machines.map((machine) => machine.createBy)))
        .filter(Boolean)
        .map((createBy) => ({
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
            .map((machine) => machine.updateBy)
            .filter((value): value is string => Boolean(value)),
        ),
      ).map((updateBy) => ({
        text: updateBy,
        value: updateBy,
      })),
    [machines],
  );

  const handleSearch = async (
    page = machinePage,
    pageSize = machinePageSize,
  ) => {
    await fetchMachines(page, pageSize);
  };

  const handleDeleteMachine = useCallback(
    async (id: number) => {
      const request: DeleteMachineRequest = { id };

      try {
        await deleteMachineAsync(request);
        toast.success("Xóa máy thành công");

        await fetchMachines();
      } catch (error) {
        console.error("Xóa máy không thành công:", error);
        toast.error("Xóa máy không thành công");
      }
    },
    [fetchMachines],
  );

  const columns = useMemo<ColumnsType<Machine>>(
    () => [
      {
        title: "Tên máy",
        dataIndex: "name",
        fixed: "left",
        width: 250,
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (value: string) => (
          <Space>
            <Avatar
              size={28}
              icon={<AppstoreOutlined />}
              style={{
                background: "#e8f1ff",
                color: "#1677ff",
              }}
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
        render: (value: string) => <Tag color="blue">{value}</Tag>,
      },
      {
        title: "Loại máy",
        dataIndex: "type",
        width: 170,
        filters: typeMachineFilter,
        onFilter: (value, record) => record.type === value,
        render: (value: string, record: Machine) => {
          if (!record.isAutomatic) {
            return (
              <Tag icon={<UserOutlined />} color="blue">
                Manual
              </Tag>
            );
          }

          return (
            <Tag
              icon={<ToolOutlined />}
              color={value === "NC Milling" ? "gold" : "green"}
            >
              {value}
            </Tag>
          );
        },
      },
      {
        title: "Thương hiệu",
        dataIndex: "brand",
        width: 130,
        filters: brandMachineFilter,
        onFilter: (value, record) => record.brand === value,
      },
      {
        title: "Thanh ghi trạng thái",
        dataIndex: "statusBitAddress",
        width: 150,
        onFilter: (value, record) => record.statusBitAddress === value,
      },
      {
        title: "Thanh ghi part",
        dataIndex: "partBitAddress",
        width: 150,
        onFilter: (value, record) => record.partBitAddress === value,
      },
      {
        title: "Thanh ghi process",
        dataIndex: "partProcessBitAddress",
        width: 150,
        onFilter: (value, record) => record.partProcessBitAddress === value,
      },
      {
        title: "Người tạo",
        dataIndex: "createBy",
        width: 130,
        filters: createByMachineFilter,
        onFilter: (value, record) => record.createBy === value,
        render: (value: string) => (
          <Space>
            <Avatar
              size={28}
              style={{
                background: "#dbeafe",
                color: "#1677ff",
              }}
            >
              {value?.[0]?.toUpperCase() || "A"}
            </Avatar>
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
        render: (value?: string | null) =>
          value ? (
            <Space>
              <Avatar
                size={28}
                style={{
                  background: "#dbeafe",
                  color: "#1677ff",
                }}
              >
                {value[0]?.toUpperCase() || "A"}
              </Avatar>
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
              Cập nhật
            </Button>

            <Popconfirm
              title="Xóa máy"
              description={
                <div style={{ lineHeight: 1.6 }}>
                  <p style={{ margin: 0 }}>
                    Bạn có chắc chắn muốn xóa máy <strong>{record.name}</strong>
                    ?
                  </p>

                  <p style={{ margin: "8px 0 0", color: "#faad14" }}>
                    <strong>Lưu ý:</strong> Máy đã có lịch sử bảo trì hoặc đã
                    tham gia gia công Part sẽ <strong>không thể xóa</strong>.
                  </p>
                </div>
              }
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
      brandMachineFilter,
      createByMachineFilter,
      handleDeleteMachine,
      typeMachineFilter,
      updateByMachineFilter,
    ],
  );

  return (
    <>
      <Card>
        <div className="d-flex justify-content-between align-items-center gap-3">
          <div className="d-flex gap-2 align-items-center grow mb-3">
            <Input
              style={{ width: 400 }}
              value={searchText}
              placeholder="Tìm theo tên, mã hoặc thương hiệu máy ..."
              allowClear
              prefix={<SearchOutlined />}
              onChange={(event) => setSearchText(event.target.value)}
              onPressEnter={async () => {
                setMachinePage(1);
                await handleSearch(1, machinePageSize);
              }}
            />

            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={async () => {
                setMachinePage(1);
                await handleSearch(1, machinePageSize);
              }}
            >
              Tìm kiếm
            </Button>
          </div>

          <Button
            icon={<PlusOutlined />}
            onClick={() => setIsCreateMachineOpen(true)}
          >
            Thêm máy
          </Button>
        </div>

        <Table<Machine>
          rowKey="id"
          size="small"
          loading={loading}
          columns={columns}
          dataSource={machines}
          scroll={{
            x: "max-content",
            y: "calc(100vh - 285px)",
          }}
          pagination={{
            current: machinePage,
            pageSize: machinePageSize,
            total: totalMachines,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} máy`,
            onChange: async (page, pageSize) => {
              setMachinePage(page);
              setMachinePageSize(pageSize);
              await handleSearch(page, pageSize);
            },
          }}
        />
      </Card>

      <CreateMachine
        open={isCreateMachineOpen}
        onClose={() => setIsCreateMachineOpen(false)}
        onCreate={async () => {
          setIsCreateMachineOpen(false);
          await fetchMachines();
        }}
      />

      <UpdateMachine
        open={Boolean(editingMachine)}
        machine={editingMachine}
        onClose={() => setEditingMachine(null)}
        onUpdate={async () => {
          setEditingMachine(null);
          await fetchMachines();
        }}
      />
    </>
  );
}
