"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getMachinesAsync } from "@/app/services/machine/MachineService";
import { toast } from "react-toastify";
import {
  CreateMachineRequest,
  DeleteMachineRequest,
  Machine,
} from "@/app/types";
import type { ColumnsType } from "antd/es/table";
import {
  Button,
  Card,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  createMachineAsync,
  deleteMachineAsync,
} from "@/app/services/machine/MachineService";
import CreateMachine from "./CreateMachine";
import { ColumnFilterItem } from "antd/es/table/interface";

const { Title } = Typography;
const { Search } = Input;

export function MachinesPage() {
  const [loading, setLoading] = useState(true);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

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

  const handleCreate = async (request: CreateMachineRequest) => {
    await createMachineAsync(request)
      .then((data) => {
        console.log(data);
        fetchMachines();
        toast.success("Tạo máy thành công");
      })
      .catch((error) => {
        toast.error("Tạo máy không thành công");
        console.error("Tạo máy không thành công:", error);
      });
  };

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
        title: "Id",
        dataIndex: "id",
        key: "id",
        width: 50,
        sorter: (a, b) => a.id - b.id,
        render: (value: string) => <strong>{value}</strong>,
      },
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        width: 120,
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: "Mã",
        dataIndex: "code",
        key: "code",
        width: 120,
        sorter: (a, b) => a.code.localeCompare(b.code),
      },
      {
        title: "Loại",
        dataIndex: "type",
        key: "type",
        width: 100,
        filters: typeFilter,
        onFilter: (value, record) => record.type === value,
      },
      {
        title: "Thương hiệu",
        dataIndex: "brand",
        key: "brand",
        width: 100,
        filters: brandFilter,
        onFilter: (value, record) => record.brand === value,
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 160,
        fixed: "right",
        align: "right",
        render: (_, record) => (
          <Space>
            <Button size="small">Sửa</Button>

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

            <Button size="small">Xem chi tiết</Button>
          </Space>
        ),
      },
    ],
    [typeFilter],
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
      </div>
    </>
  );
}
