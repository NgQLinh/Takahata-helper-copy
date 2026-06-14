"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
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
import type { ColumnsType } from "antd/es/table";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import { Account } from "@/app/types/account/Account";
import {
  createAccountAsync,
  getAccountsAsync,
  updateAccountAsync,
  deleteAccountAsync,
} from "@/app/services/account/AccountService";
import { DeleteAccountRequest, UpdateAccountRequest } from "@/app/types";
import { toast } from "react-toastify";

const { Title } = Typography;
const { Search } = Input;

export function UserAndRolePage() {
  const [users, setUsers] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Account | null>(null);
  const [searchText, setSearchText] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = searchText.toLowerCase();

      return (
        user.userName.toLowerCase().includes(keyword) ||
        user.fullName.toLowerCase().includes(keyword)
      );
    });
  }, [users, searchText]);

  useEffect(() => {
    getAccountsAsync()
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Lỗi khi call API:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    await getAccountsAsync()
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Lỗi khi call API:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCreate = async (request: Omit<Account, "id" | "isActive">) => {
    await createAccountAsync(request)
      .then((data) => {
        console.log(data);
        fetchUsers();
        toast.success("Tạo tài khoản thành công");
      })
      .catch((error) => {
        toast.error("Tạo tài khoản không thành công");
        console.error("Tạo tài khoản không thành công:", error);
      });
  };

  const handleUpdate = async (updatedUser: Account) => {
    const request: UpdateAccountRequest = {
      id: updatedUser.id,
      userName: updatedUser.userName,
      fullName: updatedUser.fullName,
      password: updatedUser.password,
      role: updatedUser.role,
    };

    setEditingUser(null);

    await updateAccountAsync(request)
      .then((data) => {
        console.log(data.userName);
        fetchUsers();
        toast.success("Cập nhật tài khoản thành công");
      })
      .catch((error) => {
        toast.error("Cập nhật tài khoản không thành công");
        console.error("Cập nhật tài khoản không thành công:", error);
      });
  };

  const handleDelete = async (userId: Account["id"]) => {
    const request: DeleteAccountRequest = {
      id: userId,
    };
    await deleteAccountAsync(request)
      .then((data) => {
        console.log(data.userName);
        fetchUsers();
        toast.success("Xóa tài khoản thành công");
      })
      .catch((error) => {
        toast.error("Xóa tài khoản không thành công");
        console.error("Xóa tài khoản không thành công:", error);
      });
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
          { text: "ADMIN", value: "ADMIN" },
          { text: "MANAGER", value: "MANAGER" },
          { text: "USER", value: "USER" },
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
        <div className="mb-4">
          <Search
            placeholder="Tìm theo tên đăng nhập hoặc họ tên"
            allowClear
            enterButton
            style={{ width: 350 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Table<Account>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={filteredUsers}
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
