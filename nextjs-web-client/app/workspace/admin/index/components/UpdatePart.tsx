"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Descriptions,
  Flex,
  Form,
  Grid,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Skeleton,
  Table,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "react-toastify";

import { Machine, PartProcess, PartType } from "@/app/types";
import { ApiError } from "@/app/types/common/ApiError";
import { ProcessStatus } from "@/app/types/common/ProcessStatus";
import { getMachinesAsync } from "@/app/services/machine/MachineService";
import {
  deletePartAsync,
  getPartAsync,
  updatePartAsync,
} from "@/app/services/index/IndexService";
import { v4 as uuidv4 } from "uuid";
import { getStatusTag } from "@/app/utilities/UtilityState";

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const FORM_ID = "update-part-form";

type Props = {
  id?: number | null;
  open: boolean;
  onClose: () => void;
};

type PlanRow = {
  key: string;
  id: number;
  machineId?: number;
  plantDate?: Dayjs | null;
  startTime?: Dayjs | null;
  endTime?: Dayjs | null;
  workingTime: number | null;
  setupTime: number | null;
  waitingTime: number | null;
  status: ProcessStatus;
  note?: string | null;
  performedBy?: string | null;
  estimatedTime?: number | null;
  workerNote?: string | null;
};

type FormValues = {
  IndexCode?: string;
  PartCode: string;
  Quantity: number;
  Prioritize: boolean;
  PartType: PartType;
};

type CurrentPartInfo = {
  indexCode: string;
  partCode: string;
  quantity: number;
  prioritize: boolean;
  partType: PartType;
};

const createEmptyRow = (): PlanRow => ({
  key: uuidv4(),
  id: 0,
  machineId: undefined,
  plantDate: dayjs(),
  startTime: null,
  endTime: null,
  workingTime: null,
  setupTime: null,
  waitingTime: null,
  status: ProcessStatus.Planned,
  note: "",
  performedBy: "",
  estimatedTime: null,
  workerNote: null,
});

const statusOptions = [
  { value: ProcessStatus.Planned, label: "Đã lên kế hoạch" },
  { value: ProcessStatus.InProgress, label: "Đang thực hiện" },
  { value: ProcessStatus.Completed, label: "Hoàn thành" },
  { value: ProcessStatus.Cancelled, label: "Đã hủy" },
  { value: ProcessStatus.PartiallyCompleted, label: "Hoàn thành một phần" },
];

export default function UpdatePart({ id, open, onClose }: Props) {
  const [form] = Form.useForm<FormValues>();
  const screens = useBreakpoint();

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingMachine, setLoadingMachine] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [dataSource, setDataSource] = useState<PlanRow[]>([createEmptyRow()]);
  const [currentPartInfo, setCurrentPartInfo] =
    useState<CurrentPartInfo | null>(null);

  const isDesktop = Boolean(screens.xl);
  const tableScrollY = isDesktop ? "calc(100dvh - 390px)" : 360;
  const isBusy = loadingDetail || submitting;

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
          quantity: data.quantity,
          prioritize: data.prioritize,
          partType: data.partType,
        });

        form.setFieldsValue({
          IndexCode: currentIndexCode,
          PartCode: currentPartCode,
          Quantity: data.quantity,
          Prioritize: data.prioritize,
          PartType: data.partType,
        });

        const rows: PlanRow[] =
          data.processes?.length > 0
            ? data.processes.map((process: PartProcess) => ({
                key: uuidv4(),
                id: process.id,
                machineId: process.machineId,
                plantDate: process.plantDate ? dayjs(process.plantDate) : null,
                startTime: process.startTime ? dayjs(process.startTime) : null,
                endTime: process.endTime ? dayjs(process.endTime) : null,
                workingTime: process.workingTime,
                setupTime: process.setupTime,
                waitingTime: process.waitingTime,
                status: process.status ?? ProcessStatus.Planned,
                note: process.note ?? "",
                performedBy: process.performedBy ?? "",
                estimatedTime: process.estimatedTime ?? 0,
                workerNote: process.workerNote,
              }))
            : [createEmptyRow()];

        setDataSource(rows);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết Part:", error);

        if (error instanceof ApiError) {
          toast.error(error.getDisplayMessage());
        } else {
          toast.error("Không lấy được chi tiết Part.");
        }
      } finally {
        setLoadingDetail(false);
      }
    },
    [form],
  );

  useEffect(() => {
    const run = async () => {
      form.resetFields();
      setCurrentPartInfo(null);
      setDataSource([createEmptyRow()]);

      if (!id) {
        toast.error("Không tìm thấy ID Part cần cập nhật.");
        return;
      }

      void Promise.all([fetchMachines(), fetchDetail(id)]);
    };

    if (!open) return;

    void run();
  }, [fetchDetail, fetchMachines, form, id, open]);

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

  const handleDelete = async () => {
    if (submitting) return;

    try {
      await deletePartAsync(id || 0);
      toast.success("Xóa part thành công.");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.getDisplayMessage());
        return;
      }

      toast.error("Có lỗi xảy ra.");
    } finally {
      resetForm();
      onClose();
    }
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

    const invalidPlanDateRow = dataSource.findIndex((row) => !row.plantDate);

    if (invalidPlanDateRow !== -1) {
      toast.warning(
        `Vui lòng chọn ngày kế hoạch tại dòng ${invalidPlanDateRow + 1}.`,
      );
      return false;
    }

    const invalidEstimatedTime = dataSource.findIndex(
      (row) => !row.estimatedTime || row.estimatedTime <= 0,
    );

    if (invalidEstimatedTime !== -1) {
      toast.warning(
        `Vui lòng nhập thời gian dự kiến tại dòng ${invalidEstimatedTime + 1}.`,
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
    const partCode = values.PartCode?.trim();

    const request = {
      id,
      indexCode,
      partCode,
      quantity: values.Quantity,
      prioritize: values.Prioritize,
      partType: values.PartType,
      partProcesses: dataSource.map((item, index) => ({
        id: item.id,
        sequence: index + 1,
        machineId: item.machineId,
        plantDate: item.plantDate?.format("YYYY-MM-DD") ?? null,
        startTime: item.startTime?.format("YYYY-MM-DDTHH:mm:ssZ"),
        endTime: item.endTime?.format("YYYY-MM-DDTHH:mm:ssZ"),
        workingTime: item.workingTime,
        setupTime: item.setupTime,
        waitingTime: item.waitingTime,
        status: item.status,
        note: item.note?.trim() ?? "",
        performedBy: item.performedBy,
        estimatedTime: item.estimatedTime ?? 0,
      })),
    };

    console.log(request);

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
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật Part.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<PlanRow> = [
    {
      title: "STT",
      key: "sequence",
      fixed: "left",
      width: 64,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Máy",
      fixed: "left",
      dataIndex: "machineId",
      key: "machineId",
      width: 250,
      render: (value: number | undefined, record) => (
        <Select
          showSearch
          allowClear
          placeholder="Chọn máy"
          loading={loadingMachine}
          disabled={isBusy}
          value={value}
          options={machineOptions}
          style={{ width: "100%" }}
          onChange={(machineId: number | undefined) =>
            handleChange(record.key, "machineId", machineId)
          }
        />
      ),
    },
    {
      title: "Ngày kế hoạch",
      dataIndex: "plantDate",
      key: "plantDate",
      width: 170,
      render: (value: Dayjs | null | undefined, record) => (
        <DatePicker
          placeholder="Chọn ngày"
          value={value}
          format="DD/MM/YYYY"
          disabled={isBusy}
          style={{ width: "100%" }}
          onChange={(date) => handleChange(record.key, "plantDate", date)}
        />
      ),
    },
    {
      title: "Thời gian dự kiến (giờ)",
      dataIndex: "estimatedTime",
      key: "estimatedTime",
      width: 170,
      render: (value: number | null | undefined, record) => (
        <InputNumber
          className="w-100"
          min={0}
          onChange={(v) => handleChange(record.key, "estimatedTime", v)}
          value={value}
          step={0.5}
          placeholder="Nhập số giờ làm"
        />
      ),
    },
    {
      title: "Người thực hiện",
      dataIndex: "performedBy",
      key: "performedBy",
      width: 200,
      render: (value: string | undefined, record) => (
        <Input
          value={value}
          placeholder="Nhập ghi chú"
          maxLength={500}
          disabled={isBusy}
          onChange={(event) =>
            handleChange(record.key, "performedBy", event.target.value)
          }
        />
      ),
    },
    {
      title: "Bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      width: 170,
      render: (value: Dayjs | null | undefined, record) => (
        <DatePicker
          allowClear
          placeholder="Nhập thời gian."
          value={value}
          showTime={{
            format: "HH:mm",
          }}
          format="DD/MM/YYYY HH:mm"
          disabled={isBusy}
          style={{ width: "100%" }}
          onChange={(date) => handleChange(record.key, "startTime", date)}
        />
      ),
    },
    {
      title: "Kế thúc",
      dataIndex: "endTime",
      key: "endTime",
      width: 170,
      render: (value: Dayjs | null | undefined, record) => (
        <DatePicker
          allowClear
          placeholder="Nhập thời gian."
          value={value}
          showTime={{
            format: "HH:mm",
          }}
          format="DD/MM/YYYY HH:mm"
          disabled={isBusy}
          style={{ width: "100%" }}
          onChange={(date) => handleChange(record.key, "endTime", date)}
        />
      ),
    },
    {
      title: "Máy chạy (giờ)",
      dataIndex: "workingTime",
      key: "workingTime",
      width: 125,
      render: (value: number | null | undefined, record) => (
        <InputNumber
          className="w-100"
          min={0}
          onChange={(v) => handleChange(record.key, "workingTime", v)}
          value={value}
          step={0.5}
          placeholder="Nhập số giờ làm"
        />
      ),
    },
    {
      title: "Gá đặt (giờ)",
      dataIndex: "setupTime",
      key: "setupTime",
      width: 125,
      render: (value: number | null | undefined, record) => (
        <InputNumber
          className="w-100"
          min={0}
          onChange={(v) => handleChange(record.key, "setupTime", v)}
          value={value}
          step={0.5}
          placeholder="Nhập số giờ làm"
        />
      ),
    },
    {
      title: "Chờ (giờ)",
      dataIndex: "waitingTime",
      key: "waitingTime",
      width: 125,
      render: (value: number | null | undefined, record) => (
        <InputNumber
          className="w-100"
          min={0}
          onChange={(v) => handleChange(record.key, "waitingTime", v)}
          value={value}
          step={0.5}
          placeholder="Nhập số giờ làm"
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
          disabled={isBusy}
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
          disabled={isBusy}
          onChange={(event) =>
            handleChange(record.key, "note", event.target.value)
          }
        />
      ),
    },
    {
      title: "Ghi chú của người vận hành",
      dataIndex: "workerNote",
      key: "workerNote",
      width: 280,
      render: (value: string | undefined, record) => (
        <Input
          value={value}
          placeholder="Nhập ghi chú"
          maxLength={500}
          disabled={isBusy}
          onChange={(event) =>
            handleChange(record.key, "workerNote", event.target.value)
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
            disabled={dataSource.length === 1 || isBusy}
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
      width="calc(100vw - 100px)"
      title={
        <Flex vertical gap={2}>
          <Title level={4} style={{ margin: 0 }}>
            Cập nhật Part và quy trình
          </Title>
          <Text type="secondary">
            Chỉnh sửa thông tin Part và tiến độ thực hiện trên từng máy
          </Text>
        </Flex>
      }
      onCancel={handleCancel}
      closable={!submitting}
      keyboard={!submitting}
      destroyOnHidden
      footer={
        <Flex justify="space-between" align="center" wrap gap={12}>
          <Text type="secondary">
            <Text strong>{dataSource.length}</Text> công đoạn trong quy trình
          </Text>

          <Flex gap={8} wrap>
            <Button danger onClick={handleDelete}>
              Xóa
            </Button>

            <Button disabled={submitting} onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              form={FORM_ID}
              icon={<SaveOutlined />}
              loading={submitting}
              disabled={loadingDetail || !id}
            >
              Cập nhật Part
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
        disabled={loadingDetail}
        onFinish={handleSubmit}
      >
        <Row gutter={[16, 16]} align="stretch">
          <Col xs={24} xl={7}>
            <Card
              title={
                <Flex vertical gap={2}>
                  <Text strong>Thông tin Part</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Đối chiếu dữ liệu hiện tại trước khi chỉnh sửa
                  </Text>
                </Flex>
              }
              styles={{ body: { padding: 20 } }}
              style={{ height: "100%" }}
            >
              {loadingDetail ? (
                <Skeleton active paragraph={{ rows: 6 }} />
              ) : (
                <>
                  <Descriptions
                    size="small"
                    column={1}
                    bordered
                    items={[
                      {
                        key: "indexCode",
                        label: "Index hiện tại",
                        children: (
                          <Text copyable={Boolean(currentPartInfo?.indexCode)}>
                            {currentPartInfo?.indexCode || "-"}
                          </Text>
                        ),
                      },
                      {
                        key: "partCode",
                        label: "Part Code hiện tại",
                        children: (
                          <Text copyable={Boolean(currentPartInfo?.partCode)}>
                            {currentPartInfo?.partCode || "-"}
                          </Text>
                        ),
                      },
                    ]}
                    style={{ marginBottom: 20 }}
                  />

                  <Form.Item
                    label="Index"
                    name="IndexCode"
                    rules={[
                      { required: true, message: "Vui lòng nhập Index" },
                      {
                        whitespace: true,
                        message: "Index không được để trống",
                      },
                    ]}
                  >
                    <Input
                      allowClear
                      placeholder="Nhập mã Index"
                      maxLength={100}
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

                  <Form.Item
                    label="Số lượng"
                    name="Quantity"
                    rules={[
                      { required: true, message: "Vui lòng nhập số lượng" },
                    ]}
                  >
                    <Input
                      allowClear
                      placeholder="Nhập số lượng"
                      maxLength={100}
                      autoFocus
                    />
                  </Form.Item>

                  <Form.Item
                    label="Loại gia công"
                    name="PartType"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn loại gia công",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Chọn loại gia công"
                      allowClear
                      options={[
                        {
                          value: PartType.NewMold,
                          label: "New mold - Khuôn mới",
                        },
                        {
                          value: PartType.NewMoldRepairMakeNew,
                          label: "New mold repair / make new",
                        },
                        {
                          value: PartType.MoldEcn,
                          label: "Mold ECN",
                        },
                        {
                          value: PartType.MoldMp,
                          label: "Mold MP",
                        },
                        {
                          value: PartType.MoldOvershort,
                          label: "Mold Overshort",
                        },
                        {
                          value: PartType.JigMoldAssyEng,
                          label: "Jig / Mold / Assembly / Engineering",
                        },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    name="Prioritize"
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <Checkbox>Ưu tiên gia công</Checkbox>
                  </Form.Item>

                  <Alert
                    type="info"
                    showIcon
                    description="Index chưa tồn tại sẽ được tạo tự động khi cập nhật."
                  />
                </>
              )}
            </Card>
          </Col>

          <Col xs={24} xl={17}>
            <Card
              title={
                <Flex vertical gap={2}>
                  <Text strong>Kế hoạch máy</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Cập nhật máy, ngày kế hoạch, ngày thực tế và trạng thái
                  </Text>
                </Flex>
              }
              extra={
                <Button
                  type="primary"
                  ghost
                  icon={<PlusOutlined />}
                  disabled={isBusy}
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
                size="small"
                bordered
                tableLayout="fixed"
                loading={loadingDetail}
                scroll={{ x: 1200, y: tableScrollY }}
                locale={{ emptyText: "Chưa có công đoạn" }}
              />
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
