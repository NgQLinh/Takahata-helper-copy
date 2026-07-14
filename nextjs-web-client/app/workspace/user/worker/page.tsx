"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
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
import { getMachinesAsync } from "@/app/services/machine/MachineService";
import { toast } from "react-toastify";
import { Machine } from "@/app/types";

const { Text, Title } = Typography;
const { TextArea } = Input;

type MachineStatus = "ready" | "maintenance";

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
  // New state
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loadingMachine, setLoadingMachine] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [total, setTotal] = useState(100);

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

  // New function
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
  }, [fetchMachines]);

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
    <main
      className="container-fluid overflow-hidden p-2"
      style={{ height: "100vh" }}
    >
      <div className="d-flex h-100 gap-2 overflow-hidden">
        {/* Cột chọn máy */}
        <section
          className="flex-shrink-0 h-100 overflow-hidden"
          style={{ width: 320 }}
        >
          <Card
            className="processing-card machine-card h-100"
            styles={{
              body: {
                height: "calc(100% - 57px)",
                padding: 12,
                overflow: "hidden",
              },
            }}
            title={
              <div className="d-flex align-items-center gap-2">
                <span className="section-number">1</span>
                <span>Chọn máy</span>
              </div>
            }
          >
            <div className="d-flex flex-column h-100 overflow-hidden">
              <div className="flex-shrink-0 mb-2">
                <Input
                  allowClear
                  prefix={<SearchOutlined />}
                  placeholder="Tìm kiếm máy theo tên hoặc mã..."
                  value={machineKeyword}
                  onChange={(event) => setMachineKeyword(event.target.value)}
                />
              </div>

              <div className="flex-grow-1 overflow-auto pe-1">
                {filteredMachines.length > 0 ? (
                  filteredMachines.map((machine) => {
                    const isSelected = selectedMachineId === machine.id;

                    return (
                      <button
                        type="button"
                        key={machine.id}
                        className={`machine-item w-100 mb-2 ${
                          isSelected ? "selected" : ""
                        }`}
                        // onClick={() => handleSelectMachine(machine.id)}
                      >
                        <Radio checked={isSelected} />

                        <div className="machine-thumbnail">
                          <ToolOutlined />
                        </div>

                        <div className="machine-information">
                          <strong>{machine.code}</strong>
                          <span title={machine.name}>{machine.name}</span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Không tìm thấy máy"
                    className="machine-empty"
                  />
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* Khu vực bên phải */}
        <section className="flex-grow-1 h-100 overflow-hidden">
          <div className="d-flex flex-column h-100 gap-2 overflow-hidden">
            {/* Danh sách chi tiết */}
            <Card
              className="processing-card processing-list-card flex-grow-1 overflow-hidden"
              styles={{
                body: {
                  height: "calc(100% - 57px)",
                  padding: 12,
                  overflow: "hidden",
                },
              }}
              title={
                <div className="d-flex align-items-center gap-2">
                  <span className="section-number">2</span>
                  <span>Danh sách chi tiết cần gia công</span>
                </div>
              }
            >
              <div className="h-100 overflow-hidden">
                <Table<ProcessingItem>
                  rowKey="id"
                  size="small"
                  columns={processingColumns}
                  dataSource={items}
                  scroll={{
                    x: "max-content",
                    y: "calc(100vh - 540px)",
                  }}
                  pagination={{
                    current: page,
                    pageSize,
                    total: items.length,
                    showSizeChanger: true,
                    pageSizeOptions: [5, 10, 20],
                    showTotal: (totalItems, range) =>
                      `Hiển thị ${range[0]} - ${range[1]} / ${totalItems} chi tiết`,
                    onChange: (newPage, newPageSize) => {
                      const pageSizeChanged = newPageSize !== pageSize;

                      setPage(pageSizeChanged ? 1 : newPage);
                      setPageSize(newPageSize);
                    },
                  }}
                  rowClassName={(record) =>
                    selectedItemId === record.id ? "selected-table-row" : ""
                  }
                  onRow={(record) => ({
                    onClick: () => handleSelectItem(record),
                  })}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          selectedMachine
                            ? "Máy này chưa có chi tiết cần gia công"
                            : "Vui lòng chọn máy"
                        }
                      />
                    ),
                  }}
                />
              </div>
            </Card>

            {/* Thông tin gia công - chiều cao cố định 360px */}
            <Card
              className="processing-card processing-information-card shrink-0"
              style={{ height: 360 }}
              styles={{
                body: {
                  height: "calc(100% - 57px)",
                  padding: 12,
                  overflow: "hidden",
                },
              }}
              title={
                <div className="d-flex align-items-center gap-2">
                  <span className="section-number">3</span>
                  <span>Thông tin gia công</span>
                </div>
              }
            >
              <div className="d-flex flex-column h-100 overflow-hidden">
                <div className="d-flex justify-content-between align-items-center gap-3 shrink-0">
                  <div className="grow overflow-hidden">
                    <div className="d-flex align-items-center gap-2">
                      <Text type="secondary">Máy:</Text>
                      <Text strong ellipsis={{ tooltip: true }}>
                        {selectedMachine
                          ? `${selectedMachine.code} - ${selectedMachine.name}`
                          : "Chưa chọn máy"}
                      </Text>
                    </div>

                    <div className="d-flex align-items-center gap-2 mt-1">
                      <Text type="secondary">Chi tiết:</Text>
                      <Text strong ellipsis={{ tooltip: true }}>
                        {selectedItem
                          ? `${selectedItem.indexCode} - ${selectedItem.partName}`
                          : "Chưa chọn chi tiết"}
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

                <div className="my-2 shrink-0">
                  <Progress
                    percent={completedPercent}
                    size="small"
                    status={completedPercent === 100 ? "success" : "active"}
                  />
                </div>

                <div className="grow overflow-auto pe-1">
                  <Form<ProcessingFormValues>
                    form={processingForm}
                    layout="vertical"
                    initialValues={{
                      setupTime: 15,
                      waitingTime: 10,
                      actualTime: 0,
                      machineTime: 0,
                      processedQuantity: 0,
                      passedQuantity: 0,
                      note: "",
                    }}
                  >
                    <Row gutter={[12, 0]}>
                      <Col xs={24} sm={12} xl={8}>
                        <Form.Item
                          label="Thời gian gá đặt"
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

                      <Col xs={24} sm={12} xl={8}>
                        <Form.Item label="Thời gian chờ" name="waitingTime">
                          <InputNumber
                            min={0}
                            className="w-100"
                            addonAfter="phút"
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={12} xl={8}>
                        <Form.Item label="Thời gian thực tế" name="actualTime">
                          <InputNumber
                            min={0}
                            className="w-100"
                            addonAfter={<ClockCircleOutlined />}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={12} xl={8}>
                        <Form.Item
                          label="Thời gian chạy máy"
                          name="machineTime"
                        >
                          <InputNumber
                            min={0}
                            className="w-100"
                            addonAfter="phút"
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={12} xl={8}>
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
                    </Row>
                  </Form>
                </div>

                <div className="d-flex justify-content-end align-items-center gap-2 pt-2 border-top shrink-0">
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
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
