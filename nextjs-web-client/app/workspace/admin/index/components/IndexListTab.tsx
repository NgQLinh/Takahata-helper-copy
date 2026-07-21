"use client";

import {
  deleteIndexesAsync,
  searchIndexesAsync,
} from "@/app/services/index/IndexService";
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import UpdateIndex from "./UpdateIndex";

const { Text } = Typography;

interface Props {
  active: boolean;
}

export default function IndexListTab({ active }: Props) {
  const [editingIndex, setEditingIndex] = useState<Index | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [total, setTotal] = useState(0);

  const [indexes, setIndexes] = useState<Index[]>([]);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const request = {
        keyword: searchText,
        page: page,
        pageSize: pageSize,
      };

      const data = await searchIndexesAsync(request);

      setIndexes(data.data);
      setTotal(data.totalItems);
      setPage(data.page);
      setPageSize(data.pageSize);
    } catch (error) {
      console.error("Không thể tải lịch sử bảo dưỡng:", error);
      toast.error("Không thể tải lịch sử bảo dưỡng");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchText]);

  useEffect(() => {
    const run = async () => {
      await handleSearch();
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, page, pageSize]);

  const handleDelete = useCallback(
    async (id: number) => {
      const request = { id };

      try {
        await deleteIndexesAsync(request);
        toast.success("Xóa máy thành công");

        await handleSearch();
      } catch (error) {
        console.error("Xóa máy không thành công:", error);
        toast.error("Xóa máy không thành công");
      }
    },
    [handleSearch],
  );

  const columns = useMemo<ColumnsType<Index>>(
    () => [
      {
        title: "Mã index",
        dataIndex: "code",
        fixed: "left",
        width: 150,
        render: (value: string) => <div>{value}</div>,
      },
      {
        title: "Số lượng part",
        dataIndex: "countPart",
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
              onClick={() => setEditingIndex(record)}
            >
              Sửa
            </Button>

            <Popconfirm
              title="Xóa index"
              description="Bạn có chắc muốn xóa index? các part bên trong index cũng sẽ bị xóa."
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
    [handleDelete],
  );

  return (
    <Card>
      <div className="machine-toolbar d-flex justify-content-between align-items-center gap-3">
        <div className="d-flex gap-2 align-items-center grow  mb-3">
          <Input
            style={{ width: 400 }}
            value={searchText}
            placeholder="Tìm theo index code ..."
            allowClear
            prefix={<SearchOutlined />}
            onChange={(event) => setSearchText(event.target.value)}
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
          onChange: async (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
      />

      <UpdateIndex
        open={Boolean(editingIndex)}
        index={editingIndex}
        onClose={async () => {
          setEditingIndex(null);
          await handleSearch();
        }}
      />
    </Card>
  );
}
