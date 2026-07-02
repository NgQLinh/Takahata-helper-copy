"use client";

import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useMemo, useState } from "react";
import CreatePart from "./CreatePart";
import {
  deletePartAsync,
  searchPartAsync,
} from "@/app/services/index/IndexService";
import { toast } from "react-toastify";
import Title from "antd/es/typography/Title";
import { ApiError } from "@/app/types/common/ApiError";
import UpdatePart from "./UpdatePart";
import { Part, PartProcess } from "@/app/types";

type RowType = "MC" | "P" | "A";

type TableRow = {
  key: string;
  partId: number;
  indexCode?: string;
  partName?: string;
  rowType: RowType;
  rowSpan: number;
  processes: Record<number, PartProcess | undefined>;
};

const processCount = 15;

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const mapPartsToRows = (parts: Part[]): TableRow[] => {
  return parts.flatMap((part) => {
    return [
      {
        key: `${part.id}-MC`,
        partId: part.id,
        indexCode: part.index?.code,
        partName: part.code,
        rowType: "MC",
        rowSpan: 3,
        processes: part.processes,
      },
      {
        key: `${part.id}-P`,
        partId: part.id,
        rowType: "P",
        rowSpan: 0,
        processes: part.processes,
      },
      {
        key: `${part.id}-A`,
        partId: part.id,
        rowType: "A",
        rowSpan: 0,
        processes: part.processes,
      },
    ];
  });
};

export function IndexPage() {
  const [keyword, setKeyword] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState<Part[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchParts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await searchPartAsync(page, pageSize);
      setParts(data.parts);
      setTotal(data.total);
    } catch {
      toast.error("Không thể tải danh sách part");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    const run = async () => {
      try {
        await fetchParts();
      } catch {
        toast.error("Không thể tải danh sách part");
      }
    };

    void run();
  }, [fetchParts]);

  const filteredParts = useMemo(() => {
    const value = keyword.trim().toLowerCase();

    if (!value) return parts;

    return parts.filter(
      (part) =>
        part.code.toLowerCase().includes(value) ||
        part.index?.code.toLowerCase().includes(value),
    );
  }, [keyword, parts]);

  const dataSource = useMemo(() => {
    console.log(mapPartsToRows(filteredParts));
    return mapPartsToRows(filteredParts);
  }, [filteredParts]);

  const handlerUpdate = (id: number) => {
    setSelectedId(id);
    setIsUpdateOpen(true);
  };

  const handlerDelete = async (id: number) => {
    await deletePartAsync(id)
      .then((data) => {
        console.log(data);
        fetchParts();
        toast.success("Xóa part thành công.");
      })
      .catch((error) => {
        if (error instanceof ApiError) {
          toast.error(error.getDisplayMessage());
          return;
        }
        toast.error("Có lỗi xảy ra.");
      });
  };

  const columns: ColumnsType<TableRow> = [
    {
      title: (
        <div className="text-center fw-semibold">
          Index
          <br />
          <span className="small text-muted">(Tên)</span>
        </div>
      ),
      dataIndex: "indexCode",
      width: 120,
      fixed: "left",
      align: "center",
      onCell: (row) => ({
        children: <span className="fw-semibold">{row.indexCode}</span>,
        props: {
          rowSpan: row.rowSpan,
        },
      }),
    },
    {
      title: (
        <div className="fw-semibold">
          Part Name
          <br />
          <span className="small text-muted">(Tên chi tiết)</span>
        </div>
      ),
      dataIndex: "partName",
      width: 240,
      fixed: "left",
      onCell: (row) => ({
        children: <span className="fw-semibold">{row.partName}</span>,
        props: {
          rowSpan: row.rowSpan,
        },
      }),
    },
    {
      title: (
        <div className="text-center fw-semibold">
          Plan/Actual
          <br />
          <span className="small text-muted">KH/TT</span>
        </div>
      ),
      dataIndex: "rowType",
      width: 110,
      fixed: "left",
      align: "center",
      onCell: (row) => ({
        children: (
          <span className="badge text-bg-light border px-3 py-2">
            {row.rowType}
          </span>
        ),
      }),
    },
    {
      title: (
        <div className="text-center fw-bold">
          PROCESSING SCHEDULE
          <br />
          <span className="small text-muted fw-normal">
            (Lịch trình gia công)
          </span>
        </div>
      ),
      align: "center",
      children: Array.from({ length: processCount }, (_, index) => {
        const sequence = index;

        return {
          title: <span className="fw-semibold">{sequence}</span>,
          dataIndex: `process-${sequence}`,
          width: 90,
          align: "center" as const,
          render: (_, row: TableRow) => {
            const process = row.processes[sequence];

            if (!process) return <span className="text-muted">-</span>;

            if (row.rowType === "MC") {
              return process.isCompleted ? (
                <Tag color="success" className="m-0">
                  {process.machine?.code}
                </Tag>
              ) : (
                <span>{process.machine?.name}</span>
              );
            }

            if (row.rowType === "P") {
              return (
                <span className="text-primary fw-semibold">
                  {formatDate(process.planDate)}
                </span>
              );
            }

            if (row.rowType === "A") {
              if (!process.actualDate)
                return <span className="text-muted">-</span>;

              return (
                <span className="text-success fw-semibold">
                  {formatDate(process.actualDate)}
                  {process.workingHours ? `-${process.workingHours}` : ""}
                </span>
              );
            }

            return "";
          },
        };
      }),
    },
    {
      title: <span className="fw-semibold">Action</span>,
      width: 140,
      fixed: "right",
      align: "center",
      onCell: (row) => ({
        children: (
          <Space>
            <Button size="small" onClick={() => handlerUpdate(row.partId)}>
              Sửa
            </Button>

            <Popconfirm
              title="Xóa part"
              description={`Bạn có chắc muốn xóa ${row.partName}?`}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => handlerDelete(row.partId)}
            >
              <Button size="small" danger>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
        props: {
          rowSpan: row.rowSpan,
        },
      }),
    },
  ];

  return (
    <div
      className="h-100 d-flex flex-column gap-3 overflow-hidden"
      style={{ minHeight: 0 }}
    >
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Title level={3} style={{ margin: 0 }}>
            Lịch trình gia công chi tiết khuôn
          </Title>

          <Button type="primary" onClick={() => setIsCreateOpen(true)}>
            Thêm part
          </Button>
        </div>
      </Card>

      <div className="grow overflow-hidden">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <Input
            placeholder="Tìm theo Part Name hoặc Index..."
            allowClear
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ maxWidth: 360 }}
          />

          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setKeyword("");
              fetchParts();
            }}
          >
            Làm mới
          </Button>
        </div>

        <Table<TableRow>
          bordered
          size="middle"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          tableLayout="fixed"
          rowKey="key"
          scroll={{ x: 1850, y: 500 }}
          pagination={false}
        />
        <div className="d-flex justify-content-end mt-3">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showTotal={(value) => `Tổng ${value} part`}
            onChange={(nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            }}
          />
        </div>
      </div>

      <CreatePart
        open={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          fetchParts();
        }}
      />

      <UpdatePart
        id={selectedId}
        open={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          fetchParts();
        }}
      />
    </div>
  );
}
