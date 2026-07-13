"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Grid,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "react-toastify";

import { Machine } from "@/app/types";
import { ApiError } from "@/app/types/common/ApiError";
import { ProcessStatus } from "@/app/types/common/ProcessStatus";
import { getMachinesAsync } from "@/app/services/machine/MachineService";
import { createPartAsync } from "@/app/services/index/IndexService";

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const FORM_ID = "create-part-form";

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
  { value: ProcessStatus.Planned, label: "Đã lên kế hoạch" },
  { value: ProcessStatus.InProgress, label: "Đang thực hiện" },
  { value: ProcessStatus.Completed, label: "Hoàn thành" },
  { value: ProcessStatus.Cancelled, label: "Đã hủy" },
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
  const screens = useBreakpoint();

  const [loadingMachine, setLoadingMachine] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [dataSource, setDataSource] = useState<PlanRow[]>([createEmptyRow()]);

  const isDesktop = Boolean(screens.xl);
  const tableScrollY = isDesktop ? "calc(100dvh - 390px)" : 340;

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
        row.key === key ? { ...row, [field]: value } : row,
      ),
    );
  };

  const handleAddRow = () => {
    setDataSource((previousRows) => [...previousRows, createEmptyRow()]);
  };

  const handleRemoveRow = (key: string) => {
    setDataSource((previousRows) => {
      if (previousRows.length === 1) return previousRows;
      return previousRows.filter((row) => row.key !== key);
    });
  };

  const validatePlanRows = () => {
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
      toast.warning("Vui lòng nhập Index.");
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
      toast.success("Tạo Part thành công.");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Lỗi khi tạo Part:", error);

      if (error instanceof ApiError) {
        toast.error(error.getDisplayMessage());
        return;
      }

      toast.error("Có lỗi xảy ra khi tạo Part.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<PlanRow> = [
    {
      title: "STT",
      key: "sequence",
      width: 64,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Máy",
      dataIndex: "machineId",
      key: "machineId",
      width: 250,
      render: (value: number | undefined, record) => (
        <Select
          showSearch
          allowClear
          placeholder="Chọn máy"
          loading={loadingMachine}
          value={value}
          options={machineOptions}
          optionFilterProp="label"
          style={{ width: "100%" }}
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
          value={value}
          format="DD/MM/YYYY"
          style={{ width: "100%" }}
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
          value={value}
          options={statusOptions}
          style={{ width: "100%" }}
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
      width: 280,
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
      title: "",
      key: "action",
      width: 64,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Tooltip
          title={
            dataSource.length === 1
              ? "Cần giữ lại ít nhất một công đoạn"
              : "Xóa công đoạn"
          }
        >
          <Button
            danger
            type="text"
            shape="circle"
            icon={<DeleteOutlined />}
            disabled={dataSource.length === 1}
            aria-label="Xóa công đoạn"
            onClick={() => handleRemoveRow(record.key)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      centered
      width={1400}
      title={
        <Flex vertical gap={2}>
          <Title level={4} style={{ margin: 0 }}>
            Thêm mới Part và quy trình
          </Title>
          <Text type="secondary">
            Khai báo thông tin Part và kế hoạch thực hiện trên máy
          </Text>
        </Flex>
      }
      onCancel={handleCancel}
      closable={!submitting}
      maskClosable={false}
      keyboard={!submitting}
      destroyOnHidden
      confirmLoading={submitting}
      footer={
        <Flex justify="space-between" align="center" wrap gap={12}>
          <Text type="secondary">
            <Text strong>{dataSource.length}</Text> công đoạn đã khai báo
          </Text>

          <Flex gap={8}>
            <Button disabled={submitting} onClick={handleCancel}>
              Đóng
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              form={FORM_ID}
              icon={<SaveOutlined />}
              loading={submitting}
            >
              Lưu Part
            </Button>
          </Flex>
        </Flex>
      }
      styles={{
        container: {
          maxWidth: "calc(100vw - 24px)",
          maxHeight: "calc(100dvh - 24px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
        header: {
          flexShrink: 0,
          marginBottom: 0,
          paddingBottom: 16,
          borderBottom: "1px solid rgba(5, 5, 5, 0.06)",
        },
        body: {
          flex: 1,
          minHeight: 0,
          maxHeight: "calc(100dvh - 210px)",
          paddingTop: 20,
          paddingBottom: 20,
          overflowY: "auto",
          overflowX: "hidden",
        },
        footer: {
          flexShrink: 0,
          marginTop: 0,
          paddingTop: 16,
          borderTop: "1px solid rgba(5, 5, 5, 0.06)",
        },
      }}
    >
      <Form<FormValues>
        id={FORM_ID}
        form={form}
        layout="vertical"
        requiredMark="optional"
        onFinish={handleSubmit}
      >
        <Row gutter={[16, 16]} align="stretch">
          <Col xs={24} xl={6}>
            <Card
              title={
                <Flex vertical gap={2}>
                  <Text strong>Thông tin Part</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Nhập thông tin nhận diện của Part
                  </Text>
                </Flex>
              }
              styles={{
                body: { padding: 20 },
              }}
              style={{ height: "100%" }}
            >
              <Form.Item
                label="Index"
                name="IndexCode"
                rules={[
                  { required: true, message: "Vui lòng nhập Index" },
                  { whitespace: true, message: "Index không được để trống" },
                ]}
              >
                <Input
                  allowClear
                  placeholder="Nhập mã Index"
                  maxLength={100}
                  autoFocus
                />
              </Form.Item>

              <Form.Item
                label="Part Code"
                name="PartCode"
                rules={[
                  { required: true, message: "Vui lòng nhập Part Code" },
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

              <Alert
                type="info"
                showIcon
                message="Index chưa tồn tại sẽ được tạo tự động."
              />
            </Card>
          </Col>

          <Col xs={24} xl={18}>
            <Card
              title={
                <Flex vertical gap={2}>
                  <Text strong>Kế hoạch máy</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Thiết lập máy, ngày kế hoạch và trạng thái cho từng công
                    đoạn
                  </Text>
                </Flex>
              }
              extra={
                <Button
                  type="primary"
                  ghost
                  icon={<PlusOutlined />}
                  onClick={handleAddRow}
                >
                  Thêm công đoạn
                </Button>
              }
              styles={{ body: { padding: 0 } }}
              style={{ height: "100%", overflow: "hidden" }}
            >
              <Table<PlanRow>
                rowKey="key"
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                size="middle"
                bordered
                tableLayout="fixed"
                scroll={{ x: 1020, y: tableScrollY }}
                locale={{ emptyText: "Chưa có công đoạn" }}
              />
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
