"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  AppstoreOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { toast } from "react-toastify";

import {
  deleteMachineMaintenanceProcessAsync,
  getMachinesAsync,
  searchMachineMaintenanceProcess,
} from "@/app/services/machine/MachineService";
import type { DeleteMachineRequest, Machine } from "@/app/types";
import type { MachineMaintenanceProcess } from "@/app/types/machine/MachineMaintenanceProcess";
import { ProcessStatus } from "@/app/types/common/ProcessStatus";

import CreateMachineMaintenanceProcess from "./CreateMachineMaintenanceProcess";
import UpdateMachineMaintenanceProcess from "./UpdateMachineMaintenanceProcess";
import { getStatusTag } from "@/app/utilities/UtilityState";

const { Text } = Typography;
const { RangePicker } = DatePicker;

type DateRangeValue = [Dayjs | null, Dayjs | null] | null;

interface Props {
  active: boolean;
}

export default function MaintenanceHistoryTab({ active }: Props) {
  const [loading, setLoading] = useState(false);
  const [loadingMachines, setLoadingMachines] = useState(false);

  const [machineSource, setMachineSource] = useState<Machine[]>([]);
  const [maintenanceProcesses, setMaintenanceProcesses] = useState<
    MachineMaintenanceProcess[]
  >([]);

  const [filterMachineIds, setFilterMachineIds] = useState<number[]>([]);
  const [filterStatuses, setFilterStatuses] = useState<ProcessStatus[]>([]);
  const [filterDateRange, setFilterDateRange] = useState<DateRangeValue>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [totalItems, setTotalItems] = useState(0);

  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedProcessId, setSelectedProcessId] = useState<number | null>(
    null,
  );

  const fetchMachineSource = useCallback(async () => {
    setLoadingMachines(true);

    try {
      const data = await getMachinesAsync();
      setMachineSource(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách máy:", error);
      toast.error("Không thể tải danh sách máy");
    } finally {
      setLoadingMachines(false);
    }
  }, []);

  const fetchMaintenanceProcesses = useCallback(
    async (currentPage = page, currentPageSize = pageSize) => {
      await fetchMachineSource();

      setLoading(true);

      try {
        const result = await searchMachineMaintenanceProcess({
          machineIds: filterMachineIds,
          statuses: filterStatuses,
          from: filterDateRange?.[0]
            ? filterDateRange[0].format("YYYY-MM-DD")
            : null,
          to: filterDateRange?.[1]
            ? filterDateRange[1].format("YYYY-MM-DD")
            : null,
          page: currentPage,
          pageSize: currentPageSize,
        });

        setMaintenanceProcesses(result.data);
        setPage(result.page ?? currentPage);
        setPageSize(result.pageSize ?? currentPageSize);
        setTotalItems(result.totalItems);
      } catch (error) {
        console.error("Không thể tải lịch sử bảo dưỡng:", error);
        toast.error("Không thể tải lịch sử bảo dưỡng");
      } finally {
        setLoading(false);
      }
    },
    [
      fetchMachineSource,
      filterDateRange,
      filterMachineIds,
      filterStatuses,
      page,
      pageSize,
    ],
  );

  useEffect(() => {
    const run = async () => {
      await fetchMaintenanceProcesses();
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const getCurrentMonthRange = (): DateRangeValue => [
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ];

  const handleResetFilter = async () => {
    // const emptyMachineIds: number[] = [];
    const emptyStatuses: ProcessStatus[] = [];
    const currentMonthRange = getCurrentMonthRange();

    // setFilterMachineIds(emptyMachineIds);
    setFilterStatuses(emptyStatuses);
    setFilterDateRange(currentMonthRange);
    setPage(1);

    await fetchMaintenanceProcesses();
  };

  const handleDelete = useCallback(
    async (id: number) => {
      const request: DeleteMachineRequest = { id };

      try {
        await deleteMachineMaintenanceProcessAsync(request);
        toast.success("Xóa lịch bảo dưỡng thành công");

        await fetchMaintenanceProcesses();
      } catch (error) {
        console.error("Xóa lịch bảo dưỡng không thành công:", error);
        toast.error("Xóa lịch bảo dưỡng không thành công");
      }
    },
    [fetchMaintenanceProcesses],
  );

  const handleOpenUpdate = (id: number) => {
    setSelectedProcessId(id);
    setUpdateOpen(true);
  };

  const columns = useMemo<ColumnsType<MachineMaintenanceProcess>>(
    () => [
      {
        title: "Máy",
        dataIndex: "machine",
        fixed: "left",
        width: 200,
        render: (machine) => (
          <Space>
            <Avatar
              size={28}
              icon={<AppstoreOutlined />}
              style={{
                background: "#e8f1ff",
                color: "#1677ff",
              }}
            />

            <Text strong>{machine?.name || machine?.code || "-"}</Text>
          </Space>
        ),
      },
      {
        title: "Ngày kế hoạch",
        dataIndex: "plantDate",
        width: 150,
        render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "-"),
      },
      {
        title: "Bắt đầu",
        dataIndex: "startTime",
        width: 150,
        render: (value) =>
          value ? dayjs(value).format("DD/MM/YYYY HH:mm:ss") : "-",
      },
      {
        title: "Kết thúc",
        dataIndex: "endTime",
        width: 150,
        render: (value) =>
          value ? dayjs(value).format("DD/MM/YYYY HH:mm:ss") : "-",
      },
      {
        title: "Người thực hiện",
        dataIndex: "performedBy",
        width: 150,
        render: (value) => value || "-",
      },
      {
        title: "Thời gian dự kiến (giờ)",
        dataIndex: "estimatedTime",
        width: 180,
        render: (value) => value || "-",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        width: 150,
        render: (status: ProcessStatus) => {
          return getStatusTag(status);
        },
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        width: 200,
        render: (value) => value || "-",
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
              Cập nhật
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
    [handleDelete],
  );

  return (
    <>
      <Card className="machine-card">
        <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-3">
          <div className="d-flex flex-wrap align-items-end gap-3">
            <div style={{ width: 250 }}>
              <label className="form-label mb-1">Máy</label>

              <Select
                mode="multiple"
                showSearch={{
                  filterOption: (input, option) =>
                    String(option?.code ?? "")
                      .toLocaleLowerCase()
                      .includes(input.trim().toLocaleLowerCase()),
                }}
                allowClear
                loading={loadingMachines}
                placeholder="Chọn máy"
                style={{ width: "100%" }}
                value={filterMachineIds}
                onChange={setFilterMachineIds}
                maxTagCount="responsive"
                options={machineSource.map((machine) => ({
                  value: machine.id,
                  label: `${machine.name} - ${machine.code}`,
                  code: machine.code,
                }))}
              />
            </div>

            <div style={{ width: 270 }}>
              <label className="form-label mb-1">Ngày kế hoạch</label>

              <RangePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                value={filterDateRange}
                onChange={(dates) =>
                  setFilterDateRange(dates as DateRangeValue)
                }
                placeholder={["Từ ngày", "Đến ngày"]}
              />
            </div>

            <Button onClick={() => void handleResetFilter()}>
              Tháng hiện tại
            </Button>

            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={async () => {
                setPage(1);
                await fetchMaintenanceProcesses(1, pageSize);
              }}
            >
              Tìm kiếm
            </Button>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOpen(true)}
          >
            Thêm lịch bảo dưỡng
          </Button>
        </div>

        <Table<MachineMaintenanceProcess>
          rowKey="id"
          columns={columns}
          size="small"
          dataSource={maintenanceProcesses}
          loading={loading}
          scroll={{
            x: "max-content",
            y: "calc(100vh - 300px)",
          }}
          pagination={{
            current: page,
            pageSize,
            total: totalItems,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bản ghi`,
            onChange: async (current, size) => {
              setPage(current);
              setPageSize(size);
              await fetchMaintenanceProcesses(current, size);
            },
          }}
        />
      </Card>

      <CreateMachineMaintenanceProcess
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          void fetchMaintenanceProcesses();
        }}
      />

      <UpdateMachineMaintenanceProcess
        id={selectedProcessId}
        open={updateOpen}
        onClose={() => {
          setUpdateOpen(false);
          setSelectedProcessId(null);
          void fetchMaintenanceProcesses();
        }}
      />
    </>
  );
}
