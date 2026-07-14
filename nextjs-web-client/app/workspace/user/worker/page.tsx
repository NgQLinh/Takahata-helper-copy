"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Pagination,
  Progress,
  Radio,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  SendOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import "./page.css";

const { Text, Title } = Typography;
const { TextArea } = Input;

type MachineStatus = "ready" | "maintenance";

type Machine = {
  id: number;
  code: string;
  name: string;
  image: string;
  status: MachineStatus;
};

type ProcessingStatus = "waiting" | "processing" | "completed";

type Priority = "low" | "medium" | "high";

type ProcessingItem = {
  id: number;
  indexCode: string;
  partName: string;
  quantity: number;
  processedQuantity: number;
  priority: Priority;
  status: ProcessingStatus;
};

type ExceptionStatus = "pending" | "approved" | "rejected";

type ProcessingException = {
  id: number;
  createdAt: string;
  type: string;
  description: string;
  severity: Priority;
  status: ExceptionStatus;
};

type ProcessingFormValues = {
  setupTime: number;
  waitingTime: number;
  actualTime: number;
  machineTime: number;
  processedQuantity: number;
  passedQuantity: number;
  note?: string;
};

type ExceptionFormValues = {
  type: string;
  description: string;
  severity: Priority;
};

const machines: Machine[] = [
  {
    id: 1,
    code: "MC-001",
    name: "Máy tiện CNC 01",
    image: "⚙️",
    status: "ready",
  },
  {
    id: 2,
    code: "MC-002",
    name: "Máy phay CNC 02",
    image: "🏭",
    status: "ready",
  },
  {
    id: 3,
    code: "MC-003",
    name: "Máy mài phẳng 01",
    image: "🔩",
    status: "maintenance",
  },
  {
    id: 4,
    code: "MC-004",
    name: "Máy khoan 02",
    image: "🛠️",
    status: "ready",
  },
  {
    id: 5,
    code: "MC-005",
    name: "Máy cắt dây 01",
    image: "⚙️",
    status: "ready",
  },
];

const initialProcessingItems: ProcessingItem[] = [
  {
    id: 1,
    indexCode: "IDX-1001",
    partName: "Trục chính",
    quantity: 10,
    processedQuantity: 2,
    priority: "high",
    status: "waiting",
  },
  {
    id: 2,
    indexCode: "IDX-1002",
    partName: "Bạc dẫn hướng",
    quantity: 20,
    processedQuantity: 0,
    priority: "medium",
    status: "waiting",
  },
  {
    id: 3,
    indexCode: "IDX-1003",
    partName: "Vỏ hộp số",
    quantity: 5,
    processedQuantity: 5,
    priority: "high",
    status: "completed",
  },
  {
    id: 4,
    indexCode: "IDX-1004",
    partName: "Puly truyền động",
    quantity: 15,
    processedQuantity: 7,
    priority: "medium",
    status: "processing",
  },
  {
    id: 5,
    indexCode: "IDX-1005",
    partName: "Bánh răng",
    quantity: 30,
    processedQuantity: 0,
    priority: "low",
    status: "waiting",
  },
];

const initialExceptions: ProcessingException[] = [
  {
    id: 1,
    createdAt: "13/07/2026 10:30",
    type: "Cần sửa chữa gấp",
    description:
      "Máy rung mạnh bất thường, phát ra tiếng kêu lớn ở trục chính.",
    severity: "high",
    status: "pending",
  },
];

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  high: {
    label: "Cao",
    color: "red",
  },
  medium: {
    label: "Trung bình",
    color: "orange",
  },
  low: {
    label: "Thấp",
    color: "green",
  },
};

const statusConfig: Record<ProcessingStatus, { label: string; color: string }> =
  {
    waiting: {
      label: "Chờ gia công",
      color: "blue",
    },
    processing: {
      label: "Đang gia công",
      color: "orange",
    },
    completed: {
      label: "Hoàn thành",
      color: "green",
    },
  };

const exceptionStatusConfig: Record<
  ExceptionStatus,
  { label: string; color: string }
> = {
  pending: {
    label: "Chờ duyệt",
    color: "orange",
  },
  approved: {
    label: "Đã duyệt",
    color: "green",
  },
  rejected: {
    label: "Từ chối",
    color: "red",
  },
};

export default function Page() {
  const [processingForm] = Form.useForm<ProcessingFormValues>();
  const [exceptionForm] = Form.useForm<ExceptionFormValues>();

  const [selectedMachineId, setSelectedMachineId] = useState<number>(1);
  const [selectedItemId, setSelectedItemId] = useState<number>(1);
  const [machineKeyword, setMachineKeyword] = useState("");
  const [items, setItems] = useState<ProcessingItem[]>(initialProcessingItems);
  const [exceptions, setExceptions] =
    useState<ProcessingException[]>(initialExceptions);

  const [isRunning, setIsRunning] = useState(false);
  const [showExceptionForm, setShowExceptionForm] = useState(true);

  const selectedMachine = useMemo(
    () => machines.find((machine) => machine.id === selectedMachineId),
    [selectedMachineId],
  );

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId),
    [items, selectedItemId],
  );

  const filteredMachines = useMemo(() => {
    const normalizedKeyword = machineKeyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return machines;
    }

    return machines.filter((machine) => {
      const searchableText = `${machine.code} ${machine.name}`.toLowerCase();

      return searchableText.includes(normalizedKeyword);
    });
  }, [machineKeyword]);

  const summary = useMemo(() => {
    const completed = items.filter(
      (item) => item.status === "completed",
    ).length;

    const processing = items.filter(
      (item) => item.status === "processing",
    ).length;

    return {
      total: 12,
      completed,
      processing,
      remaining: 12 - completed - processing,
    };
  }, [items]);

  const handleSelectItem = (item: ProcessingItem) => {
    if (item.status === "completed") {
      return;
    }

    setSelectedItemId(item.id);

    processingForm.setFieldsValue({
      processedQuantity: item.processedQuantity,
      passedQuantity: item.processedQuantity,
    });
  };

  const handleStartProcessing = () => {
    if (!selectedItem) {
      return;
    }

    setIsRunning(true);

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              status: "processing",
            }
          : item,
      ),
    );
  };

  const handlePauseProcessing = () => {
    setIsRunning(false);
  };

  const handleCompleteProcessing = async () => {
    const values = await processingForm.validateFields();

    if (!selectedItem) {
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              processedQuantity: values.processedQuantity ?? item.quantity,
              status: "completed",
            }
          : item,
      ),
    );

    setIsRunning(false);
  };

  const handleCreateException = async () => {
    const values = await exceptionForm.validateFields();

    const newException: ProcessingException = {
      id: Date.now(),
      createdAt: new Date().toLocaleString("vi-VN"),
      type: values.type,
      description: values.description,
      severity: values.severity,
      status: "pending",
    };

    setExceptions((currentExceptions) => [...currentExceptions, newException]);

    exceptionForm.resetFields();
    setShowExceptionForm(false);
  };

  const handleDeleteException = (id: number) => {
    setExceptions((currentExceptions) =>
      currentExceptions.filter((item) => item.id !== id),
    );
  };

  const processingColumns: ColumnsType<ProcessingItem> = [
    {
      title: "",
      key: "select",
      width: 44,
      align: "center",
      render: (_, record) => (
        <Radio
          checked={selectedItemId === record.id}
          disabled={record.status === "completed"}
          onChange={() => handleSelectItem(record)}
        />
      ),
    },
    {
      title: "#",
      key: "index",
      width: 48,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã Index",
      dataIndex: "indexCode",
      width: 110,
    },
    {
      title: "Tên chi tiết",
      dataIndex: "partName",
      width: 170,
      ellipsis: true,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      width: 90,
      align: "center",
    },
    {
      title: "Đã gia công",
      dataIndex: "processedQuantity",
      width: 105,
      align: "center",
    },
    {
      title: "Còn lại",
      key: "remaining",
      width: 90,
      align: "center",
      render: (_, record) =>
        Math.max(record.quantity - record.processedQuantity, 0),
    },
    {
      title: "Ưu tiên",
      dataIndex: "priority",
      width: 105,
      align: "center",
      render: (priority: Priority) => (
        <Tag color={priorityConfig[priority].color}>
          {priorityConfig[priority].label}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 130,
      align: "center",
      render: (status: ProcessingStatus) => (
        <Tag color={statusConfig[status].color}>
          {statusConfig[status].label}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      fixed: "right",
      align: "center",
      render: (_, record) =>
        record.status === "completed" ? (
          <Text type="secondary">-</Text>
        ) : (
          <Button
            type={selectedItemId === record.id ? "primary" : "default"}
            size="small"
            onClick={() => handleSelectItem(record)}
          >
            Chọn
          </Button>
        ),
    },
  ];

  const exceptionColumns: ColumnsType<ProcessingException> = [
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      width: 130,
    },
    {
      title: "Loại ngoại lệ",
      dataIndex: "type",
      width: 160,
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Mức độ",
      dataIndex: "severity",
      width: 90,
      align: "center",
      render: (severity: Priority) => (
        <Tag color={priorityConfig[severity].color}>
          {priorityConfig[severity].label}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 110,
      align: "center",
      render: (status: ExceptionStatus) => (
        <Tag color={exceptionStatusConfig[status].color}>
          {exceptionStatusConfig[status].label}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 90,
      align: "center",
      render: (_, record) => (
        <Space size={4}>
          <Button type="text" size="small" icon={<EditOutlined />} />

          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteException(record.id)}
          />
        </Space>
      ),
    },
  ];

  const completedPercent = selectedItem
    ? Math.round(
        (selectedItem.processedQuantity / Math.max(selectedItem.quantity, 1)) *
          100,
      )
    : 0;

  return (
    <main className="worker-processing-page">
      <Row gutter={[12, 12]}>
        <Col xs={24} xl={5}>
          <Card
            className="h-100 processing-card machine-card"
            title={
              <div className="section-title">
                <span className="section-number">1</span>
                <span>Chọn máy</span>
              </div>
            }
          >
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm máy theo tên hoặc mã..."
              value={machineKeyword}
              onChange={(event) => setMachineKeyword(event.target.value)}
              className="mb-3"
            />

            <div className="machine-list">
              {filteredMachines.map((machine) => {
                const isSelected = selectedMachineId === machine.id;

                return (
                  <button
                    type="button"
                    key={machine.id}
                    className={`machine-item ${isSelected ? "selected" : ""}`}
                    disabled={machine.status === "maintenance"}
                    onClick={() => setSelectedMachineId(machine.id)}
                  >
                    <Radio checked={isSelected} />

                    <div className="machine-thumbnail">
                      <span>{machine.image}</span>
                    </div>

                    <div className="machine-information">
                      <strong>{machine.code}</strong>
                      <span>{machine.name}</span>

                      <small
                        className={
                          machine.status === "ready"
                            ? "status-ready"
                            : "status-maintenance"
                        }
                      >
                        <span className="status-dot" />
                        {machine.status === "ready" ? "Sẵn sàng" : "Bảo trì"}
                      </small>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={19}>
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Card
                className="processing-card"
                title={
                  <div className="section-title">
                    <span className="section-number">2</span>
                    <span>Danh sách chi tiết cần gia công</span>
                  </div>
                }
                extra={
                  <div className="summary-list">
                    <div className="summary-box summary-total">
                      <Statistic
                        title="Tổng số chi tiết"
                        value={summary.total}
                      />
                    </div>

                    <div className="summary-box summary-completed">
                      <Statistic
                        title="Đã hoàn thành"
                        value={summary.completed}
                      />
                    </div>

                    <div className="summary-box summary-processing">
                      <Statistic
                        title="Đang gia công"
                        value={summary.processing}
                      />
                    </div>

                    <div className="summary-box summary-remaining">
                      <Statistic title="Còn lại" value={summary.remaining} />
                    </div>
                  </div>
                }
              >
                <Table<ProcessingItem>
                  rowKey="id"
                  size="small"
                  columns={processingColumns}
                  dataSource={items}
                  pagination={false}
                  scroll={{ x: 1100 }}
                  rowClassName={(record) =>
                    selectedItemId === record.id ? "selected-table-row" : ""
                  }
                  onRow={(record) => ({
                    onClick: () => handleSelectItem(record),
                  })}
                />

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
                  <Text type="secondary">
                    Hiển thị 1 đến 5 trong tổng số 12 chi tiết
                  </Text>

                  <Pagination
                    size="small"
                    current={1}
                    pageSize={5}
                    total={12}
                    showSizeChanger
                    pageSizeOptions={[5, 10, 20]}
                  />
                </div>
              </Card>
            </Col>

            <Col xs={24} xxl={12}>
              <Card
                className="processing-card h-100"
                title={
                  <div className="section-title">
                    <span className="section-number">3</span>
                    <span>Thông tin gia công</span>
                  </div>
                }
              >
                <div className="current-job-panel">
                  <div>
                    <div>
                      <Text type="secondary">Máy: </Text>
                      <Text strong>
                        {selectedMachine?.code} - {selectedMachine?.name}
                      </Text>
                    </div>

                    <div>
                      <Text type="secondary">Chi tiết: </Text>
                      <Text strong>
                        {selectedItem?.indexCode} - {selectedItem?.partName}
                      </Text>
                    </div>
                  </div>

                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    disabled={!selectedItem || isRunning}
                    onClick={handleStartProcessing}
                  >
                    {isRunning ? "Đang gia công" : "Bắt đầu gia công"}
                  </Button>
                </div>

                <Progress
                  percent={completedPercent}
                  size="small"
                  className="mb-3"
                  status={
                    selectedItem?.status === "completed" ? "success" : "active"
                  }
                />

                <Form<ProcessingFormValues>
                  form={processingForm}
                  layout="vertical"
                  initialValues={{
                    setupTime: 15,
                    waitingTime: 10,
                    actualTime: 0,
                    machineTime: 0,
                    processedQuantity: selectedItem?.processedQuantity ?? 0,
                    passedQuantity: selectedItem?.processedQuantity ?? 0,
                    note: "",
                  }}
                >
                  <Row gutter={12}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Thời gian gá đặt (phút)"
                        name="setupTime"
                        rules={[
                          {
                            required: true,
                            message: "Nhập thời gian gá đặt",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          className="w-100"
                          addonAfter="phút"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Thời gian chờ (phút)"
                        name="waitingTime"
                      >
                        <InputNumber
                          min={0}
                          className="w-100"
                          addonAfter="phút"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Thời gian thực tế (phút)"
                        name="actualTime"
                      >
                        <InputNumber
                          min={0}
                          className="w-100"
                          addonAfter={<ClockCircleOutlined />}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                      <Form.Item label="Thời gian chạy máy" name="machineTime">
                        <InputNumber
                          min={0}
                          className="w-100"
                          addonAfter="phút"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Số lượng gia công"
                        name="processedQuantity"
                        rules={[
                          {
                            required: true,
                            message: "Nhập số lượng gia công",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={selectedItem?.quantity}
                          className="w-100"
                          addonAfter={`/${selectedItem?.quantity ?? 0}`}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                      <Form.Item label="Số lượng đạt" name="passedQuantity">
                        <InputNumber
                          min={0}
                          max={selectedItem?.quantity}
                          className="w-100"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item label="Ghi chú" name="note">
                        <TextArea
                          rows={4}
                          placeholder="Nhập ghi chú nếu có..."
                          maxLength={500}
                          showCount
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      icon={<PauseOutlined />}
                      disabled={!isRunning}
                      onClick={handlePauseProcessing}
                    >
                      Tạm dừng
                    </Button>

                    <Button
                      type="primary"
                      className="complete-button"
                      icon={<CheckCircleOutlined />}
                      disabled={!selectedItem}
                      onClick={handleCompleteProcessing}
                    >
                      Hoàn thành
                    </Button>
                  </div>
                </Form>
              </Card>
            </Col>

            <Col xs={24} xxl={12}>
              <Card
                className="processing-card h-100"
                title={
                  <div className="section-title">
                    <span className="section-number">4</span>
                    <span>Ngoại lệ nếu có</span>
                  </div>
                }
                extra={
                  <Button
                    type="default"
                    icon={<PlusOutlined />}
                    className="exception-button"
                    onClick={() => setShowExceptionForm((current) => !current)}
                  >
                    Thêm ngoại lệ
                  </Button>
                }
              >
                <Table<ProcessingException>
                  rowKey="id"
                  size="small"
                  columns={exceptionColumns}
                  dataSource={exceptions}
                  pagination={false}
                  scroll={{ x: 760 }}
                />

                {showExceptionForm && (
                  <div className="exception-form-wrapper mt-3">
                    <Title level={5}>Thêm ngoại lệ mới</Title>

                    <Form<ExceptionFormValues>
                      form={exceptionForm}
                      layout="vertical"
                      initialValues={{
                        severity: "high",
                      }}
                    >
                      <Row gutter={12}>
                        <Col xs={24} lg={7}>
                          <Form.Item
                            label="Loại ngoại lệ"
                            name="type"
                            rules={[
                              {
                                required: true,
                                message: "Chọn loại ngoại lệ",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Chọn loại ngoại lệ"
                              options={[
                                {
                                  label: "Cần sửa chữa gấp",
                                  value: "Cần sửa chữa gấp",
                                },
                                {
                                  label: "Sai thông số kỹ thuật",
                                  value: "Sai thông số kỹ thuật",
                                },
                                {
                                  label: "Thiếu nguyên vật liệu",
                                  value: "Thiếu nguyên vật liệu",
                                },
                                {
                                  label: "Dừng máy bất thường",
                                  value: "Dừng máy bất thường",
                                },
                                {
                                  label: "Khác",
                                  value: "Khác",
                                },
                              ]}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} lg={10}>
                          <Form.Item
                            label="Mô tả chi tiết"
                            name="description"
                            rules={[
                              {
                                required: true,
                                message: "Nhập mô tả ngoại lệ",
                              },
                            ]}
                          >
                            <TextArea
                              rows={3}
                              placeholder="Nhập mô tả chi tiết về ngoại lệ..."
                              maxLength={500}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} lg={7}>
                          <Form.Item
                            label="Mức độ"
                            name="severity"
                            rules={[
                              {
                                required: true,
                                message: "Chọn mức độ",
                              },
                            ]}
                          >
                            <Select
                              options={[
                                {
                                  label: "Cao",
                                  value: "high",
                                },
                                {
                                  label: "Trung bình",
                                  value: "medium",
                                },
                                {
                                  label: "Thấp",
                                  value: "low",
                                },
                              ]}
                            />
                          </Form.Item>

                          <div className="d-flex justify-content-end">
                            <Button
                              type="primary"
                              icon={<SendOutlined />}
                              onClick={handleCreateException}
                            >
                              Gửi để duyệt
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                )}

                <Alert
                  className="mt-3"
                  type="info"
                  showIcon
                  icon={<ExclamationCircleOutlined />}
                  description="Vui lòng nhập đầy đủ thông tin và báo cáo ngoại lệ nếu có để quản lý hiệu quả quá trình gia công."
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </main>
  );
}
