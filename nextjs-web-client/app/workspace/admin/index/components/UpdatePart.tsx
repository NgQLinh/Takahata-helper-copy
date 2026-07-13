"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "react-toastify";

import { Machine, PartProcess } from "@/app/types";
import { ApiError } from "@/app/types/common/ApiError";
import { ProcessStatus } from "@/app/types/common/ProcessStatus";
import { getMachinesAsync } from "@/app/services/machine/MachineService";
import {
  getPartAsync,
  updatePartAsync,
} from "@/app/services/index/IndexService";

const { Text } = Typography;

type Props = {
  id?: number | null;
  open: boolean;
  onClose: () => void;
};

type PlanRow = {
  key: string;
  id: number;
  machineId?: number;
  planDate?: Dayjs | null;
  actualDate?: Dayjs | null;
  status: ProcessStatus;
  note?: string;
};

type FormValues = {
  IndexCode?: string;
  PartCode: string;
};

const createEmptyRow = (): PlanRow => ({
  key: crypto.randomUUID(),
  id: 0,
  machineId: undefined,
  planDate: dayjs(),
  actualDate: null,
  status: ProcessStatus.Planned,
  note: "",
});

const statusOptions = [
  {
    value: ProcessStatus.Planned,
    label: "Đã lên kế hoạch",
  },
  {
    value: ProcessStatus.InProgress,
    label: "Đang thực hiện",
  },
  {
    value: ProcessStatus.Completed,
    label: "Hoàn thành",
  },
  {
    value: ProcessStatus.Cancelled,
    label: "Đã hủy",
  },
];

const getStatusTag = (status: ProcessStatus) => {
  switch (status) {
    case ProcessStatus.Planned:
      return <Tag color="blue">Đã lên kế hoạch</Tag>;

    case ProcessStatus.InProgress:
      return <Tag color="orange">Đang thực hiện</Tag>;

    case ProcessStatus.Completed:
      return <Tag color="green">Hoàn thành</Tag>;

    case ProcessStatus.Cancelled:
      return <Tag color="red">Đã hủy</Tag>;

    default:
      return <Tag>Không xác định</Tag>;
  }
};

export default function UpdatePart({ id, open, onClose }: Props) {
  const [form] = Form.useForm<FormValues>();

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingMachine, setLoadingMachine] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [machines, setMachines] = useState<Machine[]>([]);
  const [dataSource, setDataSource] = useState<PlanRow[]>([createEmptyRow()]);
  const [currentPartInfo, setCurrentPartInfo] = useState<{
    indexCode: string;
    partCode: string;
  } | null>(null);

  const machineOptions = useMemo(
    () =>
      machines.map((machine) => ({
        label: `${machine.name} - ${machine.code}`,
        value: machine.id,
      })),
    [machines],
  );

  const fetchMachines = useCallback(async () => {
    setLoadingMachine(true);

    try {
      const data = await getMachinesAsync();
      setMachines(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách máy:", error);
      toast.error("Không thể tải danh sách máy.");
    } finally {
      setLoadingMachine(false);
    }
  }, []);

  const fetchDetail = useCallback(
    async (partId: number) => {
      setLoadingDetail(true);

      try {
        const data = await getPartAsync(partId);

        const currentIndexCode = data.index?.code ?? "";
        const currentPartCode = data.code ?? "";

        setCurrentPartInfo({
          indexCode: currentIndexCode,
          partCode: currentPartCode,
        });

        form.setFieldsValue({
          IndexCode: currentIndexCode,
          PartCode: currentPartCode,
        });
        const rows: PlanRow[] =
          data.processes && data.processes.length > 0
            ? data.processes.map((process: PartProcess) => ({
                key: crypto.randomUUID(),
                id: process.id,
                machineId: process.machineId,
                planDate: process.planDate ? dayjs(process.planDate) : null,
                actualDate: process.actualDate
                  ? dayjs(process.actualDate)
                  : null,
                status:
                  process.status !== undefined && process.status !== null
                    ? process.status
                    : ProcessStatus.Planned,
                note: process.note ?? "",
              }))
            : [createEmptyRow()];

        setDataSource(rows);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết Part:", error);

        if (error instanceof ApiError) {
          toast.error(error.getDisplayMessage());
          return;
        }

        toast.error("Không lấy được chi tiết Part.");
      } finally {
        setLoadingDetail(false);
      }
    },
    [form],
  );

  useEffect(() => {
    if (!open) return;

    const run = async () => {
      await Promise.all([fetchMachines()]);

      if (id) {
        await fetchDetail(id);
      }
    };

    void run();
  }, [open, id, fetchMachines, fetchDetail]);

  const resetForm = () => {
    form.resetFields();
    setCurrentPartInfo(null);
    setDataSource([createEmptyRow()]);
  };

  const handleCancel = () => {
    if (submitting) return;

    resetForm();
    onClose();
  };

  const handleChange = <K extends keyof PlanRow>(
    key: string,
    field: K,
    value: PlanRow[K],
  ) => {
    setDataSource((previousRows) =>
      previousRows.map((row) =>
        row.key === key
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    );
  };

  const handleAddRow = () => {
    setDataSource((previousRows) => [...previousRows, createEmptyRow()]);
  };

  const handleRemoveRow = (key: string) => {
    setDataSource((previousRows) => {
      if (previousRows.length === 1) {
        return previousRows;
      }

      return previousRows.filter((row) => row.key !== key);
    });
  };

  const validatePlanRows = () => {
    if (dataSource.length === 0) {
      toast.warning("Vui lòng thêm ít nhất một kế hoạch máy.");
      return false;
    }

    const invalidMachineRow = dataSource.findIndex(
      (row) => row.machineId === undefined,
    );

    if (invalidMachineRow !== -1) {
      toast.warning(`Vui lòng chọn máy tại dòng ${invalidMachineRow + 1}.`);
      return false;
    }

    const invalidPlanDateRow = dataSource.findIndex((row) => !row.planDate);

    if (invalidPlanDateRow !== -1) {
      toast.warning(
        `Vui lòng chọn ngày kế hoạch tại dòng ${invalidPlanDateRow + 1}.`,
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (values: FormValues) => {
    if (!id) {
      toast.error("Không tìm thấy ID Part cần cập nhật.");
      return;
    }

    if (!validatePlanRows()) return;

    const indexCode = values.IndexCode?.trim();

    if (!indexCode) {
      toast.warning("Vui lòng nhập Index.");
      return;
    }

    const request = {
      id,
      indexCode,
      partCode: values.PartCode.trim(),
      partProcesses: dataSource.map((item, index) => ({
        id: item.id,
        sequence: index + 1,
        machineId: item.machineId,
        planDate: item.planDate?.format("YYYY-MM-DD") ?? null,
        actualDate: item.actualDate?.format("YYYY-MM-DD") ?? null,
        status: item.status,
        note: item.note?.trim() ?? "",
      })),
    };

    setSubmitting(true);

    try {
      await updatePartAsync(request);

      toast.success("Cập nhật Part thành công.");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật Part:", error);

      if (error instanceof ApiError) {
        toast.error(error.getDisplayMessage());
        return;
      }

      toast.error("Có lỗi xảy ra khi cập nhật Part.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<PlanRow> = [
    {
      title: "STT",
      key: "sequence",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Máy",
      dataIndex: "machineId",
      key: "machineId",
      width: 220,
      render: (value: number | undefined, record: PlanRow) => (
        <Select
          showSearch
          allowClear
          placeholder="Chọn máy"
          style={{ width: "100%" }}
          loading={loadingMachine}
          value={value}
          options={machineOptions}
          onChange={(machineId: number | undefined) =>
            handleChange(record.key, "machineId", machineId)
          }
        />
      ),
    },
    {
      title: "Ngày kế hoạch",
      dataIndex: "planDate",
      key: "planDate",
      width: 170,
      render: (value: Dayjs | null | undefined, record: PlanRow) => (
        <DatePicker
          placeholder="Chọn ngày"
          style={{ width: "100%" }}
          value={value}
          format="DD/MM/YYYY"
          onChange={(date) => handleChange(record.key, "planDate", date)}
        />
      ),
    },
    {
      title: "Ngày thực tế",
      dataIndex: "actualDate",
      key: "actualDate",
      width: 170,
      render: (value: Dayjs | null | undefined, record: PlanRow) => (
        <DatePicker
          placeholder="Chọn ngày"
          style={{ width: "100%" }}
          value={value}
          format="DD/MM/YYYY"
          onChange={(date) => handleChange(record.key, "actualDate", date)}
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 190,
      render: (value: ProcessStatus, record: PlanRow) => (
        <Select
          placeholder="Chọn trạng thái"
          style={{ width: "100%" }}
          value={value}
          options={statusOptions}
          optionRender={(option) => getStatusTag(option.value as ProcessStatus)}
          labelRender={(option) => getStatusTag(option.value as ProcessStatus)}
          onChange={(status: ProcessStatus) =>
            handleChange(record.key, "status", status)
          }
        />
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      minWidth: 220,
      render: (value: string | undefined, record: PlanRow) => (
        <Input
          value={value}
          placeholder="Nhập ghi chú"
          maxLength={500}
          onChange={(event) =>
            handleChange(record.key, "note", event.target.value)
          }
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 90,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Button
          danger
          type="text"
          shape="circle"
          icon={<DeleteOutlined />}
          title="Xóa dòng"
          disabled={dataSource.length === 1}
          onClick={() => handleRemoveRow(record.key)}
        />
      ),
    },
  ];

  return (
    <Modal
      title={
        <div>
          <div className="fw-semibold fs-5">Thêm mới Part và quy trình</div>

          <Text type="secondary" className="fw-normal">
            Khai báo thông tin Part và kế hoạch thực hiện trên máy
          </Text>
        </div>
      }
      open={open}
      footer={null}
      width="min(1550px, calc(100vw - 32px))"
      centered
      onCancel={handleCancel}
      destroyOnHidden
      keyboard={!submitting}
      styles={{
        container: {
          maxHeight: "calc(100vh - 32px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        },
        body: {
          height: "calc(100vh - 160px)",
          minHeight: 560,
          maxHeight: 780,
          paddingTop: 20,
          overflow: "hidden",
        },
      }}
    >
      <Form<FormValues>
        form={form}
        layout="vertical"
        requiredMark
        onFinish={handleSubmit}
        style={{
          height: "100%",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="row g-3 m-0 grow"
          style={{
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <div className="col-12 col-xl-4 px-0 pe-xl-2">
            <Card
              size="small"
              title={
                <div>
                  <div className="fw-semibold">Thông tin Part</div>

                  <Text type="secondary" className="fw-normal">
                    Nhập thông tin nhận diện của Part
                  </Text>
                </div>
              }
              style={{
                height: "100%",
                overflow: "hidden",
              }}
              styles={{
                header: {
                  minHeight: 62,
                },
                body: {
                  padding: 20,
                  overflow: "hidden",
                },
              }}
            >
              <div className="rounded border bg-light p-3 mb-4">
                <div className="fw-semibold mb-3">Thông tin hiện tại</div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <Text type="secondary" className="d-block mb-1">
                      Index hiện tại
                    </Text>

                    <Text strong copyable={Boolean(currentPartInfo?.indexCode)}>
                      {currentPartInfo?.indexCode || "-"}
                    </Text>
                  </div>

                  <div className="col-12 col-md-6">
                    <Text type="secondary" className="d-block mb-1">
                      Part Code hiện tại
                    </Text>

                    <Text strong copyable={Boolean(currentPartInfo?.partCode)}>
                      {currentPartInfo?.partCode || "-"}
                    </Text>
                  </div>
                </div>
              </div>

              <Form.Item
                label="Index mới"
                name="IndexCode"
                tooltip="Giá trị hiện tại được hiển thị phía trên để bạn đối chiếu trước khi chỉnh sửa"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Index",
                  },
                  {
                    whitespace: true,
                    message: "Index không được để trống",
                  },
                ]}
              >
                <Input allowClear placeholder="Nhập mã Index" maxLength={100} />
              </Form.Item>

              <Form.Item
                label="Part Code mới"
                name="PartCode"
                tooltip="Giá trị hiện tại được hiển thị phía trên để bạn đối chiếu trước khi chỉnh sửa"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Part Code",
                  },
                  {
                    whitespace: true,
                    message: "Part Code không được để trống",
                  },
                ]}
              >
                <Input
                  allowClear
                  placeholder="Nhập Part Code"
                  maxLength={100}
                />
              </Form.Item>

              <div className="rounded border p-3">
                <Text type="secondary">
                  Thông tin hiện tại được giữ cố định phía trên để bạn dễ đối
                  chiếu. Nếu Index mới chưa tồn tại, hệ thống sẽ tự động tạo
                  Index khi cập nhật.
                </Text>
              </div>
            </Card>
          </div>

          <div className="col-12 col-xl-8 px-0 ps-xl-2">
            <Card
              size="small"
              title={
                <div>
                  <div className="fw-semibold">Kế hoạch máy</div>

                  <Text type="secondary" className="fw-normal">
                    Thiết lập máy, thời gian và trạng thái cho từng công đoạn
                  </Text>
                </div>
              }
              style={{
                height: "100%",
                minHeight: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
              styles={{
                header: {
                  minHeight: 62,
                  flexShrink: 0,
                },
                body: {
                  flex: 1,
                  minHeight: 0,
                  padding: 0,
                  display: "grid",
                  gridTemplateRows: "minmax(0, 1fr) auto",
                  overflow: "hidden",
                },
              }}
            >
              {/* Chỉ phần này được phép cuộn */}
              <div
                style={{
                  minHeight: 0,
                  overflow: "hidden",
                }}
              >
                <Table<PlanRow>
                  rowKey="key"
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                  size="middle"
                  bordered
                  tableLayout="fixed"
                  loading={loadingDetail}
                  scroll={{
                    x: 1120,
                    y: "calc(100vh - 500px)",
                  }}
                />
              </div>

              {/* Thanh này luôn hiển thị */}
              <div
                className="d-flex justify-content-between align-items-center px-3 py-2 border-top bg-light"
                style={{
                  minHeight: 48,
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <Text type="secondary">
                  Tổng số công đoạn: {dataSource.length}
                </Text>

                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  disabled={loadingDetail || submitting}
                  onClick={handleAddRow}
                >
                  Thêm công đoạn
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <Divider style={{ margin: "24px 0 16px" }} />

        <div className="d-flex justify-content-end">
          <Space size="middle">
            <Button size="large" disabled={submitting} onClick={handleCancel}>
              Đóng
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SaveOutlined />}
              loading={submitting}
              disabled={loadingDetail}
            >
              Cập nhật Part
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}
