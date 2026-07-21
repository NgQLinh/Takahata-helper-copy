"use client";

import { Index } from "@/app/types";
import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Input,
  Popconfirm,
  Space,
  Typography,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

const { Text } = Typography;

export default function IndexListTab() {
  const [loading, setLoading] = useState(false);
  const [searchMachineText, setSearchMachineText] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [total, setTotal] = useState(0);

  const [indexes, setIndexes] = useState<Index[]>([]);

  function handleDelete(id: number): void {}

  function handleOpenUpdate(id: number): void {}

  const columns = useMemo<ColumnsType<Index>>(
    () => [
      {
        title: "Mã index",
        dataIndex: "Code",
        fixed: "left",
        width: 150,
        render: (value: string) => <div>{value}</div>,
      },
      {
        title: "Người tạo",
        dataIndex: "createBy",
        width: 120,
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

            {value || "-"}
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
              onClick={() => handleOpenUpdate(record.id)}
            >
              Sửa
            </Button>

            <Popconfirm
              title="Xóa lịch bảo dưỡng"
              description="Bạn có chắc muốn xóa?"
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
    [],
  );

  function handleSearch() {
    
  }

  function fetchIndexes(page: number, pageSize: number) {}

  return (
    <Card>
      <div className="machine-toolbar d-flex justify-content-between align-items-center gap-3">
        <div className="d-flex gap-2 align-items-center grow  mb-3">
          <Input
            style={{ width: 400 }}
            value={searchMachineText}
            placeholder="Tìm theo tên, mã hoặc thương hiệu máy ..."
            allowClear
            prefix={<SearchOutlined />}
            onChange={(event) => setSearchMachineText(event.target.value)}
            onPressEnter={() => void handleSearch()}
          />

          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => void handleSearch()}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <Table<Index>
        rowKey="id"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={indexes}
        scroll={{
          x: "max-content",
          y: "calc(100vh - 285px)",
        }}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} máy`,
          onChange: (page, pageSize) => {
            void fetchIndexes(page, pageSize);
          },
        }}
      />
    </Card>
  );
}
