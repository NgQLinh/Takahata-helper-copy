"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckCircleOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import {
  getMachinesAsync,
  getPartProcessByMachineAsync,
} from "@/app/services/machine/MachineService";
import { toast } from "react-toastify";
import { Machine, ManufacturingProcess } from "@/app/types";
import { ProcessStatus } from "@/app/types/common/ProcessStatus";
import CreatePart from "@/app/workspace/admin/index/components/CreatePart";
import {
  completeAsync,
  pauseAsync,
  startAsync,
} from "@/app/services/machine/ManufacturingService";

const { Text } = Typography;

import "./WorkerPage.css";

type ProcessingFormValues = {
  setupTime: number;
  waitingTime: number;
  startTime: number;
  machineTime: number;
  processedQuantity: number;
  passedQuantity: number;
  note?: string;
};

export default function WorkerPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [total, setTotal] = useState(100);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New state
  const [machineKeyword, setMachineKeyword] = useState("");
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [processes, setProcesses] = useState<ManufacturingProcess[]>([]);
  const [selectedProcess, setSelectedProcess] =
    useState<ManufacturingProcess | null>(null);

  const [processingForm] = Form.useForm<ProcessingFormValues>();

  const [isRunning, setIsRunning] = useState(false);

  // New function
  const fetchMachines = useCallback(async () => {
    try {
      const data = await getMachinesAsync();
      setMachines(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách máy:", error);
      toast.error("Không thể tải danh sách máy.");
    }
  }, []);

  const fetchManufacturingProcess = useCallback(async () => {
    if (selectedMachine)
      try {
        setLoading(true);

        const request = {
          machineId: selectedMachine.id,
        };

        const result = await getPartProcessByMachineAsync(request);
        setProcesses(result.data);
        setPage(result.page ?? page);
        setPageSize(result.pageSize ?? pageSize);
        setTotal(result.totalItems ?? result.data.length);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chi tiết cần gia công:", error);
        toast.error("Không thể tải danh sách chi tiết cần gia công.");
      } finally {
        setLoading(false);
      }
  }, [page, pageSize, selectedMachine]);

  useEffect(() => {
    const run = async () => {
      await Promise.all([fetchMachines()]);
    };

    if (!open) return;

    void run();
  }, [fetchMachines]);

  useEffect(() => {
    const run = async () => {
      await Promise.all([fetchManufacturingProcess()]);
    };
    if (selectedMachine) void run();
  }, [fetchManufacturingProcess, selectedMachine]);

  const filteredMachines = useMemo(() => {
    const normalizedKeyword = machineKeyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return machines;
    }

    return machines.filter((machine) => {
      const searchableText = `${machine.code} ${machine.name}`.toLowerCase();

      return searchableText.includes(normalizedKeyword);
    });
  }, [machineKeyword, machines]);

  function handleSelectItem(record: ManufacturingProcess): void {
    setSelectedProcess(record);
  }

  const handleStartProcessing = async () => {
    if (!selectedProcess) return;

    try {
      const request = {
        machineId: selectedMachine?.id,
        processId: selectedProcess.id,
        partId: selectedProcess.partId,
      };

      const data = await startAsync(request);
      await fetchManufacturingProcess();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePauseProcessing = async () => {
    if (!selectedProcess) return;
    setIsRunning(false);
    try {
      const request = {
        machineId: selectedMachine?.id,
        processId: selectedProcess.id,
        partId: selectedProcess.partId,
      };

      const data = await pauseAsync(request);
      await fetchManufacturingProcess();
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsRunning(true);
    }
  };

  const handleCompleteProcessing = async () => {
    if (!selectedProcess) return;

    try {
      const { setupTime, waitingTime, processedQuantity } =
        await processingForm.validateFields();

      const request = {
        machineId: selectedMachine?.id,
        processId: selectedProcess.id,
        partId: selectedProcess.partId,
        setupTime,
        waitingTime,
        processedQuantity,
      };
      const data = await completeAsync(request);
      await fetchManufacturingProcess();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const processingColumns: ColumnsType<ManufacturingProcess> = [
    {
      title: "#",
      fixed: "left",
      key: "index",
      width: 48,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã Index",
      fixed: "left",
      dataIndex: "indexCode",
      width: 110,
    },
    {
      title: "Tên chi tiết",
      fixed: "left",
      dataIndex: "partCode",
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
      title: "Ghi chú",
      dataIndex: "note",
      width: 200,
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
      title: "Trạng thái",
      fixed: "right",
      dataIndex: "status",
      width: 130,
      align: "center",
      render: (status: ProcessStatus) => {
        const statusMap: Record<
          ProcessStatus,
          { color: string; text: string }
        > = {
          [ProcessStatus.Planned]: {
            color: "blue",
            text: "Đã lên kế hoạch",
          },
          [ProcessStatus.InProgress]: {
            color: "processing",
            text: "Đang thực hiện",
          },
          [ProcessStatus.Completed]: {
            color: "success",
            text: "Hoàn thành",
          },
          [ProcessStatus.Cancelled]: {
            color: "error",
            text: "Đã hủy",
          },
          [ProcessStatus.Overdue]: {
            color: "warning",
            text: "Quá hạn",
          },
          [ProcessStatus.Paused]: {
            color: "warning",
            text: "Tạm dừng",
          },
          [ProcessStatus.PendingApproval]: {
            color: "warning",
            text: "Chờ phê duyệt",
          },
        };

        const current = statusMap[status] ?? {
          color: "default",
          text: "Không xác định",
        };

        return <Tag color={current.color}>{current.text}</Tag>;
      },
    },
  ];

  return (
    <div className="d-flex h-100 gap-2 overflow-hidden">
      {/* Cột chọn máy */}
      <section
        className="shrink-0 h-100 overflow-hidden"
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
            <div className="shrink-0 mb-2">
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm máy theo tên hoặc mã..."
                value={machineKeyword}
                onChange={(event) => setMachineKeyword(event.target.value)}
              />
            </div>

            <div className="grow overflow-auto pe-1">
              {filteredMachines.length > 0 ? (
                filteredMachines.map((machine) => {
                  const isSelected = selectedMachine?.id === machine.id;

                  return (
                    <button
                      type="button"
                      key={machine.id}
                      className={`btn w-100 mb-2 border rounded p-3 text-start d-flex align-items-center gap-3 ${
                        isSelected ? "btn-primary" : "btn-light"
                      }`}
                      onClick={() => setSelectedMachine(machine)}
                    >
                      <Radio checked={isSelected} />

                      <div
                        className="d-flex align-items-center justify-content-center rounded bg-body-secondary shrink-0"
                        style={{ width: 48, height: 48 }}
                      >
                        <ToolOutlined className="fs-4" />
                      </div>

                      <div className="d-flex flex-column grow overflow-hidden">
                        <strong>{machine.code}</strong>

                        <span
                          className="text-muted text-truncate"
                          title={machine.name}
                        >
                          {machine.name}
                        </span>
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
      <section className="grow h-100 overflow-hidden">
        <div className="d-flex flex-column h-100 gap-2 overflow-hidden">
          {/* Danh sách chi tiết */}
          <Card
            className="processing-card processing-list-card grow overflow-hidden"
            styles={{
              body: {
                height: "calc(100% - 57px)",
                padding: 12,
                overflow: "hidden",
              },
            }}
            title={
              <div className="d-flex justify-content-between gap-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="section-number">2</span>
                  <span>Danh sách chi tiết cần gia công</span>
                </div>

                <Button
                  onClick={() => setIsCreateOpen(true)}
                  type="primary"
                  icon={<PlusOutlined />}
                >
                  Thêm Part gia công đột xuất
                </Button>
              </div>
            }
          >
            <div className="h-100 overflow-hidden">
              <Table<ManufacturingProcess>
                rowKey="id"
                loading={loading}
                size="small"
                columns={processingColumns}
                dataSource={processes}
                scroll={{
                  x: "max-content",
                  y: "calc(100vh - 560px)",
                }}
                pagination={{
                  current: page,
                  pageSize,
                  total: total,
                  showSizeChanger: true,
                  pageSizeOptions: [5, 10, 20],
                  showTotal: (total) => `Tổng ${total} chi tiết cần gia công`,
                  onChange: (newPage, newPageSize) => {
                    const pageSizeChanged = newPageSize !== pageSize;

                    setPage(pageSizeChanged ? 1 : newPage);
                    setPageSize(newPageSize);
                  },
                }}
                rowClassName={(record) =>
                  selectedProcess?.id === record.id ? "selected-table-row" : ""
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
              <Row gutter={[16, 16]} className="grow overflow-hidden">
                {/* Cột trái: Thông tin gia công */}
                <Col xs={24} lg={8} className="h-100">
                  <div className="d-flex flex-column h-100 border rounded p-3 bg-light">
                    <div className="grow overflow-auto">
                      <div className="mb-3">
                        <Text type="secondary" className="d-block mb-1">
                          Máy
                        </Text>

                        <Text strong ellipsis={{ tooltip: true }}>
                          {selectedMachine
                            ? `${selectedMachine.code} - ${selectedMachine.name}`
                            : "Chưa chọn máy"}
                        </Text>
                      </div>

                      <div className="mb-3">
                        <Text type="secondary" className="d-block mb-1">
                          Chi tiết
                        </Text>

                        <Text strong ellipsis={{ tooltip: true }}>
                          {selectedProcess
                            ? `${selectedProcess.indexCode} - ${selectedProcess.partCode}`
                            : "Chưa chọn chi tiết"}
                        </Text>
                      </div>

                      <div className="mb-3">
                        <Text type="secondary" className="d-block mb-1">
                          Tiến độ gia công
                        </Text>

                        {/* <Progress
                            percent={completedPercent}
                            status={
                              completedPercent === 100 ? "success" : "active"
                            }
                          /> */}
                      </div>
                    </div>

                    <Button
                      type="primary"
                      size="large"
                      block
                      icon={<PlayCircleOutlined />}
                      disabled={
                        !selectedProcess ||
                        isRunning ||
                        selectedProcess.status === ProcessStatus.PendingApproval
                      }
                      onClick={handleStartProcessing}
                    >
                      {isRunning ? "Đang gia công" : "Bắt đầu gia công"}
                    </Button>
                  </div>
                </Col>

                {/* Cột phải: Form nhập thông tin */}
                <Col xs={24} lg={16} className="h-100">
                  <div className="d-flex flex-column h-100 border rounded p-3 overflow-hidden">
                    <div className="grow overflow-y-auto overflow-x-hidden px-1">
                      <Form<ProcessingFormValues>
                        form={processingForm}
                        layout="vertical"
                        initialValues={{
                          setupTime: 15,
                          waitingTime: 10,
                          startTime: 0,
                          machineTime: 0,
                          processedQuantity: 0,
                          passedQuantity: 0,
                          note: "",
                        }}
                      >
                        <Row gutter={[12, 0]}>
                          <Col xs={24} sm={12}>
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
                              <InputNumber min={0} className="w-100" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} sm={12}>
                            <Form.Item
                              label="Thời gian chờ (phút)"
                              name="waitingTime"
                            >
                              <InputNumber min={0} className="w-100" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={[12, 0]}>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              label="Số lượng đã gia công"
                              name="processedQuantity"
                              rules={[
                                {
                                  required: true,
                                  message: "Nhập số lượng đã gia công",
                                },
                              ]}
                            >
                              <InputNumber min={0} className="w-100" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form>
                    </div>

                    <div className="d-flex justify-content-end align-items-center gap-2 pt-3 mt-2 border-top shrink-0">
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
                        disabled={
                          !selectedProcess ||
                          selectedProcess.status ===
                            ProcessStatus.PendingApproval
                        }
                        onClick={handleCompleteProcessing}
                      >
                        Hoàn thành
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </div>
      </section>

      <CreatePart
        open={isCreateOpen}
        status={ProcessStatus.PendingApproval}
        onClose={() => {
          setIsCreateOpen(false);
          void fetchManufacturingProcess();
        }}
      />
    </div>
  );
}
