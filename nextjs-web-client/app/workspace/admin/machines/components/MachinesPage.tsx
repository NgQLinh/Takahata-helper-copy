"use client";

import { useState, useEffect, useMemo } from "react";
import { getMachinesAsync } from "@/app/services/machine/MachineService";
import { toast } from "react-toastify";
import { Machine, MachineType } from "@/app/types";
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

const { Title } = Typography;
const { Search } = Input;

export function MachinesPage() {
  const [loading, setLoading] = useState(true);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredMachines = useMemo(() => {
    return machines.filter((machine) => {
      const keyword = searchText.toLowerCase();

      return (
        machine.name.toLowerCase().includes(keyword) ||
        machine.code.toLowerCase().includes(keyword) ||
        machine.brand.toLowerCase().includes(keyword)
      );
    });
  }, [machines, searchText]);

  useEffect(() => {
    getMachinesAsync()
      .then((data) => {
        console.log(data);
        setMachines(data);
      })
      .catch((error) => {
        console.error("Tạo tài khoản không thành công:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {};

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
        filters: [{ text: "CNC", value: MachineType.CNC }],
        onFilter: (value, record) => record.type === value,
        render: (value: MachineType) => <strong>{getType(value)}</strong>,
      },
      {
        title: "Thương hiệu",
        dataIndex: "brand",
        key: "brand",
        width: 100,
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
    [],
  );

  const getType = (type: MachineType): string => {
    switch (type) {
      case MachineType.CNC:
        return "CNC";

      default:
        return "Unknown";
    }
  };

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
      </div>
    </>
  );
}
