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

import { Index, Machine } from "@/app/types";
import { ApiError } from "@/app/types/common/ApiError";
import { ProcessStatus } from "@/app/types/common/ProcessStatus";
import { getMachinesAsync } from "@/app/services/machine/MachineService";
import { createPartAsync } from "@/app/services/index/IndexService";

const { Text } = Typography;
type Props = {
  open: boolean;
  onClose: () => void;
};

type PlanRow = {
  key: string;
  machineId?: number;
  planDate?: Dayjs | null;
  status: ProcessStatus;
  note?: string;
};

type FormValues = {
  IndexCode?: string;
  PartCode: string;
};

const createEmptyRow = (): PlanRow => ({
  key: crypto.randomUUID(),
  machineId: undefined,
  planDate: dayjs(),
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

export default function CreatePart({ open, onClose }: Props) {
  const [form] = Form.useForm<FormValues>();

  const [loadingMachine, setLoadingMachine] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [machines, setMachines] = useState<Machine[]>([]);
  const [dataSource, setDataSource] = useState<PlanRow[]>([createEmptyRow()]);

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

  useEffect(() => {
    const run = async () => {
      await Promise.all([fetchMachines()]);
    };

    if (!open) return;

    void run();
  }, [fetchMachines, open]);

  const machineOptions = useMemo(
    () =>
      machines.map((machine) => ({
        label: `${machine.name} - ${machine.code}`,
        value: machine.id,
      })),
    [machines],
  );

  const resetForm = () => {
    form.resetFields();
    setDataSource([createEmptyRow()]);
  };

  const handleCancel = () => {
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
    if (!validatePlanRows()) return;

    const indexCode = values.IndexCode?.trim();

    if (!indexCode) {
      toast.warning("Vui lòng chọn hoặc nhập Index.");
      return;
    }

    const request = {
      indexCode,
      partCode: values.PartCode.trim(),
      partProcesses: dataSource.map((item, index) => ({
        sequence: index + 1,
        machineId: item.machineId,
        planDate: item.planDate?.format("YYYY-MM-DD") ?? null,
        status: item.status,
        note: item.note?.trim() ?? "",
      })),
    };

    setSubmitting(true);

    try {
      await createPartAsync(request);

      toast.success("Tạo part thành công.");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Lỗi khi tạo part:", error);

      if (error instanceof ApiError) {
        toast.error(error.getDisplayMessage());
        return;
      }

      toast.error("Có lỗi xảy ra khi tạo part.");
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
      render: (value: number | undefined, record) => (
        <Select
          showSearch
          allowClear
          placeholder="Chọn máy"
          style={{ width: "100%" }}
          loading={loadingMachine}
          value={value}
          options={machineOptions}
          optionFilterProp="label"
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
      render: (value: Dayjs | null | undefined, record) => (
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 190,
      render: (value: ProcessStatus, record) => (
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
      render: (value: string | undefined, record) => (
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
      width={1550}
      centered
      onCancel={handleCancel}
      destroyOnHidden
      keyboard={!submitting}
      styles={{
        body: {
          maxHeight: "78vh",
          overflowY: "auto",
          paddingTop: 20,
        },
      }}
    >
      <Form<FormValues>
        form={form}
        layout="vertical"
        requiredMark
        onFinish={handleSubmit}
      >
        <div className="row g-4 m-0">
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
              style={{ height: "100%" }}
              styles={{
                header: {
                  minHeight: 62,
                },
                body: {
                  padding: 20,
                },
              }}
            >
              <Form.Item
                label="Index"
                name="IndexCode"
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
                <Input
                  allowClear
                  placeholder="Nhập mã Index mới"
                  maxLength={100}
                />
              </Form.Item>

              <Form.Item
                label="Part Code"
                name="PartCode"
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

              <div className="rounded border bg-light p-3">
                <Text type="secondary">
                  Bạn cần nhập Index. Nếu index chưa tồn tại hệ thống sẽ tạo
                  index mới.
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
              styles={{
                header: {
                  minHeight: 62,
                },
                body: {
                  padding: 0,
                },
              }}
            >
              <Table<PlanRow>
                rowKey="key"
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                size="middle"
                bordered
                scroll={{
                  x: 950,
                  y: 380,
                }}
              />

              <div className="d-flex justify-content-between align-items-center px-3 py-2 border-top bg-light">
                <Text type="secondary">
                  Tổng số công đoạn: {dataSource.length}
                </Text>

                <Button
                  type="link"
                  icon={<PlusOutlined />}
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
            >
              Lưu Part
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}
