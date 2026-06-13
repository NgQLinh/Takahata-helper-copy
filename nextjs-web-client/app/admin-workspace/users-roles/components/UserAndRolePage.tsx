"use client";

import { useMemo, useState, useEffect } from "react";
import { Button, Card, Popconfirm, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import { Account } from "@/app/types/user/User";
import {
  createUserAsync,
  getAccountsAsync,
} from "@/app/services/account/AccountService";

const { Title } = Typography;

export function UserAndRolePage() {
  const [users, setUsers] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Account | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAccountsAsync();
        setUsers(data);
      } catch (error) {
        console.error("Lỗi khi call API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  // [] nghĩa là chỉ chạy 1 lần khi component load

  const handleCreate = async (request: Omit<Account, "id" | "isActive">) => {
    try {
      const newUser = await createUserAsync(request);

      console.log(newUser.userName);

      setUsers((prev) => [newUser, ...prev]);
    } catch (error) {
      console.error("Tạo người dùng thất bại:", error);
    }
  };

  const handleUpdate = async (updatedUser: Account) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
    );

    setEditingUser(null);
  };

  const handleDelete = (userId: Account["id"]) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const columns: ColumnsType<Account> = useMemo(
    () => [
      {
        title: "Tên đăng nhập",
        dataIndex: "userName",
        key: "userName",
        width: 180,
        sorter: (a, b) => a.userName.localeCompare(b.userName),
        render: (value: string) => <strong>{value}</strong>,
      },
      {
        title: "Họ và tên",
        dataIndex: "fullName",
        key: "fullName",
        width: 240,
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      },
      {
        title: "Vai trò",
        dataIndex: "role",
        key: "role",
        width: 140,
        filters: [
          { text: "Admin", value: "Admin" },
          { text: "Manager", value: "Manager" },
          { text: "User", value: "User" },
        ],
        onFilter: (value, record) => record.role === value,
        render: (role: string) => {
          const color =
            role === "Admin" ? "red" : role === "Manager" ? "blue" : "default";

          return <Tag color={color}>{role}</Tag>;
        },
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 160,
        fixed: "right",
        align: "right",
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => setEditingUser(record)}>
              Sửa
            </Button>

            <Popconfirm
              title="Xóa người dùng"
              description={`Bạn có chắc muốn xóa ${record.fullName}?`}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button danger size="small">
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Title level={3} style={{ margin: 0 }}>
            Quản lý tài khoản người dùng và phân quyền truy cập
          </Title>

          <Button type="primary" onClick={() => setIsCreateOpen(true)}>
            Thêm người dùng
          </Button>
        </div>
      </Card>

      <Card>
        <Table<Account>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={users}
          scroll={{ x: 900 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} người dùng`,
          }}
        />
      </Card>

      <CreateUser
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />

      <UpdateUser
        open={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
