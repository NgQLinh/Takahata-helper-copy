"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import { getMachinesAsync } from "@/app/services/machine/MachineService";
import { toast } from "react-toastify";
import {
  CreateMachineRequest,
  DeleteMachineRequest,
  Machine,
  UpdateMachineRequest,
} from "@/app/types";
import type { ColumnsType } from "antd/es/table";
import {
  Button,
  Card,
  Input,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import {
  createMachineAsync,
  deleteMachineAsync,
  updateMachineAsync,
} from "@/app/services/machine/MachineService";
import CreateMachine from "./CreateMachine";
import { ColumnFilterItem } from "antd/es/table/interface";
import UpdateMachine from "./UpdateMachine";
import MachineDetail from "./MachineDetail";

const { Title } = Typography;
const { Search } = Input;

export function MachinesPage() {
  const [loading, setLoading] = useState(true);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

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
        key: "sequenceNumber",
        width: 40,
        sorter: (a, b) => a.sequenceNumber - b.sequenceNumber,
        render: (value: string) => <strong>{value}</strong>,
      },
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        width: 80,
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: "Mã",
        dataIndex: "code",
        key: "code",
        width: 80,
        sorter: (a, b) => a.code.localeCompare(b.code),
      },
      {
        title: "Loại",
        dataIndex: "type",
        key: "type",
        width: 80,
        filters: typeFilter,
        onFilter: (value, record) => record.type === value,
      },
      {
        title: "Thương hiệu",
        dataIndex: "brand",
        key: "brand",
        width: 80,
        filters: brandFilter,
        onFilter: (value, record) => record.brand === value,
      },
      {
        title: "Người tạo",
        dataIndex: "createBy",
        key: "createBy",
        width: 80,
        filters: createByFilter,
        onFilter: (value, record) => record.createBy === value,
      },
      {
        title: "Ngày tạo",
        dataIndex: "createAt",
        key: "createAt",
        width: 120,
        render: (value: Date) => new Date(value).toLocaleString("vi-VN"),
        sorter: (a, b) =>
          new Date(a.createAt).getTime() - new Date(b.createAt).getTime(),
      },
      {
        title: "Người sửa",
        dataIndex: "updateBy",
        key: "updateBy",
        width: 80,
        filters: updateByFilter,
        onFilter: (value, record) => record.updateBy === value,
      },
      {
        title: "Ngày sửa",
        dataIndex: "updateAt",
        key: "updateAt",
        width: 120,
        render: (value?: string | Date) =>
          value ? dayjs(value).format("DD/MM/YYYY HH:mm:ss") : "-",
        sorter: (a, b) =>
          dayjs(a.updateAt).valueOf() - dayjs(b.updateAt).valueOf(),
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 160,
        fixed: "right",
        align: "right",
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => setEditingMachine(record)}>
              Sửa
            </Button>

            <Popconfirm
              title="Xóa người dùng"
              description={`Bạn có chắc muốn xóa ${record.name}?`}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button danger size="small">
                Xóa
              </Button>
            </Popconfirm>

            <Button size="small" onClick={() => setSelectedMachine(record)}>
              Xem chi tiết
            </Button>
          </Space>
        ),
      },
    ],
    [typeFilter, brandFilter, createByFilter, updateByFilter, handleDelete],
  );

  return (
    <>
      <div className="space-y-5">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Title level={3} style={{ margin: 0 }}>
              Quản lý danh sách máy
            </Title>

            <Button type="primary" onClick={() => setIsCreateOpen(true)}>
              Thêm máy
            </Button>
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <Search
              placeholder="Tìm theo tên đăng nhập hoặc họ tên"
              allowClear
              enterButton
              style={{ width: 350 }}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <Table<Machine>
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={filteredMachines}
            scroll={{ x: 900 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} máy`,
            }}
          />
        </Card>

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

        <MachineDetail
          open={!!selectedMachine}
          machine={selectedMachine}
          onClose={() => setSelectedMachine(null)}
        />
      </div>
    </>
  );
}
