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

  const handleSearch = useCallback(
    async (
      currentPage = page,
      currentPageSize = pageSize,
      keyword = searchText,
    ) => {
      setLoading(true);

      try {
        const data = await searchIndexesAsync({
          keyword: keyword.trim(),
          page: currentPage,
          pageSize: currentPageSize,
        });

        setIndexes(data.data);
        setTotal(data.totalItems);
        setPage(data.page ?? currentPage);
        setPageSize(data.pageSize ?? currentPageSize);
      } catch (error) {
        console.error("Không thể tải danh sách index:", error);
        toast.error("Không thể tải danh sách index");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, searchText],
  );

  useEffect(() => {
    const run = () => {
      void handleSearch();
    };

    if (!active) {
      return;
    }

    void run();
    // Chỉ tải lại một lần khi tab được kích hoạt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deleteIndexesAsync({ id });
        toast.success("Xóa index thành công");

        const nextPage = indexes.length === 1 && page > 1 ? page - 1 : page;

        if (nextPage !== page) {
          setPage(nextPage);
        }

        await handleSearch(nextPage, pageSize);
      } catch (error) {
        console.error("Xóa index không thành công:", error);
        toast.error("Xóa index không thành công");
      }
    },
    [handleSearch, indexes.length, page, pageSize],
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
        render: (value: number) => <div>{value}</div>,
      },
      {
        title: "Người tạo",
        dataIndex: "createBy",
        width: 120,
        render: (value?: string | null) => (
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
        render: (value) =>
          value ? (
            <Space>
              <CalendarOutlined style={{ color: "#64748b" }} />
              <span>{dayjs(value).format("HH:mm:ss DD/MM/YYYY")}</span>
            </Space>
          ) : (
            <Text type="secondary">-</Text>
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
              Cập nhật
            </Button>
            <Popconfirm
              title="Xóa index"
              description={
                <div style={{ lineHeight: 1.6 }}>
                  <p style={{ margin: 0 }}>Bạn có chắc muốn xóa index?</p>

                  <p style={{ margin: "8px 0 0", color: "#faad14" }}>
                    <strong>Lưu ý:</strong> Xóa index sẽ xóa toàn bộ part thuộc
                    index đó.
                  </p>
                </div>
              }
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
        <div className="d-flex gap-2 align-items-center grow mb-3">
          <Input
            style={{ width: 400 }}
            value={searchText}
            placeholder="Tìm theo index code ..."
            allowClear
            prefix={<SearchOutlined />}
            onChange={(event) => setSearchText(event.target.value)}
            onPressEnter={async () => {
              setPage(1);
              await handleSearch(1, pageSize);
            }}
          />

          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={async () => {
              setPage(1);
              await handleSearch(1, pageSize);
            }}
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
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (value) => `Tổng ${value} index`,
          onChange: async (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);

            await handleSearch(newPage, newPageSize);
          },
        }}
      />

      <UpdateIndex
        open={Boolean(editingIndex)}
        index={editingIndex}
        onClose={async () => {
          setEditingIndex(null);
          await handleSearch(page, pageSize);
        }}
      />
    </Card>
  );
}
