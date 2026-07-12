"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
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
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
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

import "./UserAndRolePage.css";

const { Title, Text: AntText } = Typography;

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
        console.log(data);
        fetchUsers();
        toast.success("Cập nhật tài khoản thành công");
      })
      .catch((error) => {
        toast.error("Cập nhật tài khoản không thành công");
        console.error("Cập nhật tài khoản không thành công:", error);
      });
  };

  const handleDelete = useCallback(
    async (userId: string) => {
      const request: DeleteAccountRequest = {
        id: userId,
      };
      await deleteAccountAsync(request)
        .then((data) => {
          console.log(data);
          fetchUsers();
          toast.success("Xóa tài khoản thành công");
        })
        .catch((error) => {
          toast.error("Xóa tài khoản không thành công");
          console.error("Xóa tài khoản không thành công:", error);
        });
    },
    [fetchUsers],
  );

  const columns: ColumnsType<Account> = useMemo(
    () => [
      {
        title: "Tên đăng nhập",
        dataIndex: "userName",
        key: "userName",
        width: 220,
        sorter: (a, b) => a.userName.localeCompare(b.userName),
        render: (value: string) => (
          <Space size={12}>
            <Avatar className="user-avatar" icon={<UserOutlined />} />
            <AntText strong className="user-name">
              {value}
            </AntText>
          </Space>
        ),
      },
      {
        title: "Họ và tên",
        dataIndex: "fullName",
        key: "fullName",
        width: 260,
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        render: (value: string) => <AntText>{value}</AntText>,
      },
      {
        title: "Vai trò",
        dataIndex: "role",
        key: "role",
        width: 180,
        filters: [
          { text: "ADMIN", value: "ADMIN" },
          { text: "MANAGER", value: "MANAGER" },
          { text: "USER", value: "USER" },
        ],
        onFilter: (value, record) => record.role?.toUpperCase() === value,
        render: (role: string) => {
          const normalizedRole = role?.toUpperCase();

          const className =
            normalizedRole === "ADMIN"
              ? "role-admin"
              : normalizedRole === "MANAGER"
                ? "role-manager"
                : "role-user";

          return (
            <Tag
              className={`role-tag ${className}`}
              icon={<SafetyCertificateOutlined />}
            >
              {normalizedRole}
            </Tag>
          );
        },
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 190,
        fixed: "right",
        align: "center",
        render: (_, record) => (
          <Space size={8}>
            <Button
              className="action-btn"
              icon={<EditOutlined />}
              onClick={() => setEditingUser(record)}
            >
              Sửa
            </Button>

            <Popconfirm
              title="Xóa người dùng"
              description={`Bạn có chắc muốn xóa ${record.fullName}?`}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button danger className="delete-btn" icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleDelete],
  );

  return (
    <div className="user-page">
      <Card className="user-card">
        <div className="user-header">
          <div className="user-title-wrap">
            <div className="user-icon">
              <TeamOutlined />
            </div>

            <div>
              <Title level={3} className="user-title">
                Quản lý người dùng & phân quyền
              </Title>
              <AntText type="secondary">
                Quản lý tài khoản người dùng, vai trò và quyền truy cập hệ
                thống.
              </AntText>
            </div>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateOpen(true)}
          >
            Thêm người dùng
          </Button>
        </div>

        <div className="user-divider" />

        <div className="user-toolbar">
          <Input
            placeholder="Tìm theo tên đăng nhập hoặc họ tên"
            allowClear
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 420 }}
          />
        </div>

        <Table<Account>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={filteredUsers}
          scroll={{ x: 900 }}
          className="user-table"
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
