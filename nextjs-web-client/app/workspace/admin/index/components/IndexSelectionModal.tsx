"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import type { Index } from "@/app/types";
// import { searchIndexesAsync } from "@/app/services/index/IndexService";

type Props = {
  open: boolean;
  selectedCode?: string;
  onClose: () => void;
  onSelect: (index: Index) => void;
};

type IndexSearchResponse = {
  page: number;
  pageSize: number;
  totalItems: number;
  data: Index[];
};

export default function IndexSelectionModal({
  open,
  selectedCode,
  onClose,
  onSelect,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [indexes, setIndexes] = useState<Index[]>([]);

  const [searchText, setSearchText] = useState("");
  const [submittedSearchText, setSubmittedSearchText] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchIndexes = useCallback(async () => {
    // if (!open) return;
    // setLoading(true);
    // try {
    //   const response: IndexSearchResponse = await searchIndexesAsync({
    //     searchText: submittedSearchText.trim() || undefined,
    //     page,
    //     pageSize,
    //   });
    //   setIndexes(response.data);
    //   setTotalItems(response.totalItems);
    // } catch (error) {
    //   console.error("Lỗi khi tìm kiếm index:", error);
    //   setIndexes([]);
    //   setTotalItems(0);
    // } finally {
    //   setLoading(false);
    // }
  }, [open, submittedSearchText, page, pageSize]);

  useEffect(() => {
    // void fetchIndexes();
  }, [fetchIndexes]);

  useEffect(() => {
    // if (!open) return;
    // setSearchText("");
    // setSubmittedSearchText("");
    // setPage(1);
  }, [open]);

  const handleSearch = () => {
    setPage(1);
    setSubmittedSearchText(searchText);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const nextPageSize = pagination.pageSize ?? 10;

    setPage(nextPageSize !== pageSize ? 1 : (pagination.current ?? 1));

    setPageSize(nextPageSize);
  };

  const handleSelect = (index: Index) => {
    onSelect(index);
    onClose();
  };

  const columns: ColumnsType<Index> = [
    {
      title: "Mã Index",
      dataIndex: "code",
      key: "code",
      width: 220,
    },
    {
      title: "Tên Index",
      dataIndex: "name",
      key: "name",
      render: (value?: string) => value || "-",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          onClick={(event) => {
            event.stopPropagation();
            handleSelect(record);
          }}
        >
          Chọn
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title="Chọn Index"
      open={open}
      width={900}
      footer={null}
      onCancel={onClose}
      destroyOnHidden
    >
      <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
        <Input
          allowClear
          value={searchText}
          placeholder="Nhập mã hoặc tên Index"
          prefix={<SearchOutlined />}
          onChange={(event) => setSearchText(event.target.value)}
          onPressEnter={handleSearch}
        />

        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </Space.Compact>

      <Table<Index>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={indexes}
        bordered
        size="middle"
        scroll={{ y: 420 }}
        rowClassName={(record) =>
          record.code === selectedCode ? "selected-index-row" : ""
        }
        onRow={(record) => ({
          onDoubleClick: () => handleSelect(record),
        })}
        pagination={{
          current: page,
          pageSize,
          total: totalItems,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
          showTotal: (total) => `Tổng ${total} Index`,
        }}
        onChange={handleTableChange}
      />
    </Modal>
  );
}
