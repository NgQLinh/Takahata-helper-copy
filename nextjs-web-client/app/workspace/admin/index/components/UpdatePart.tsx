"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Checkbox,
  Table,
  DatePicker,
  Space,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { Index, Machine, PartProcess } from "@/app/types";
import { getMachinesAsync } from "@/app/services/machine/MachineService";
import {
  getIndexesAsync,
  getPartAsync,
  updatePartAsync,
} from "@/app/services/index/IndexService";
import { toast } from "react-toastify";
import { ApiError } from "@/app/types/common/ApiError";

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
  note?: string;
};

type FormValues = {
  IndexCode?: string;
  NewIndexCode?: string;
  PartCode: string;
};

const createEmptyRow = (): PlanRow => ({
  key: crypto.randomUUID(),
  id: 0,
  machineId: undefined,
  planDate: null,
  note: "",
});

export default function UpdatePart({ id, open, onClose }: Props) {
  const [form] = Form.useForm<FormValues>();

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingMachine, setLoadingMachine] = useState(false);
  const [loadingIndexes, setLoadingIndexes] = useState(false);

  const [machines, setMachines] = useState<Machine[]>([]);
  const [indexes, setIndexes] = useState<Index[]>([]);
  const [isCreateNewIndex, setIsCreateNewIndex] = useState(false);
  const [dataSource, setDataSource] = useState<PlanRow[]>([createEmptyRow()]);

  const machineOptions = useMemo(
    () =>
      machines.map((machine) => ({
        label: `${machine.name} - ${machine.code}`,
        value: machine.id,
      })),
    [machines],
  );

  const indexOptions = useMemo(
    () =>
      indexes.map((index) => ({
        label: index.code,
        value: index.code,
      })),
    [indexes],
  );

  const fetchIndexes = useCallback(async () => {
    setLoadingIndexes(true);

    try {
      const data = await getIndexesAsync();
      setIndexes(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách indexes:", error);
    } finally {
      setLoadingIndexes(false);
    }
  }, []);

  const fetchMachines = useCallback(async () => {
    setLoadingMachine(true);

    try {
      const data = await getMachinesAsync();
      setMachines(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách máy:", error);
    } finally {
      setLoadingMachine(false);
    }
  }, []);

  const fetchDetail = useCallback(
    async (partId: number) => {
      setLoadingDetail(true);

      try {
        const data = await getPartAsync(partId);

        console.log("Chi tiết part:", data);

        form.setFieldsValue({
          IndexCode: data.index.code,
          PartCode: data.code,
          NewIndexCode: undefined,
        });

        const rows: PlanRow[] =
          data.processes && data.processes.length > 0
            ? data.processes.map((process: PartProcess) => ({
                key: crypto.randomUUID(),
                id: process.id,
                machineId: process.machineId,
                planDate: process.planDate ? dayjs(process.planDate) : null,
                note: process.note ?? "",
              }))
            : [createEmptyRow()];

        setDataSource(rows);
        setIsCreateNewIndex(false);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết part:", error);
        toast.error("Không lấy được chi tiết part.");
      } finally {
        setLoadingDetail(false);
      }
    },
    [form],
  );

  useEffect(() => {
    const run = async () => {
      if (!open) return;

      await fetchIndexes();
      await fetchMachines();

      if (id) {
        await fetchDetail(id);
      }
    };

    void run();
  }, [open, id, fetchIndexes, fetchMachines, fetchDetail]);

  const handleCancel = () => {
    form.resetFields();
    setIsCreateNewIndex(false);
    setDataSource([createEmptyRow()]);
    onClose();
  };

  const handleChange = <K extends keyof PlanRow>(
    key: string,
    field: K,
    value: PlanRow[K],
  ) => {
    setDataSource((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleAddRow = () => {
    setDataSource((prev) => [...prev, createEmptyRow()]);
  };

  const handleRemoveRow = (key: string) => {
    setDataSource((prev) => prev.filter((item) => item.key !== key));
  };

  const handleSubmit = async (values: FormValues) => {
    if (!id) {
      toast.error("Không tìm thấy id part cần cập nhật.");
      return;
    }

    const indexCode = isCreateNewIndex ? values.NewIndexCode : values.IndexCode;

    const request = {
      id,
      indexCode,
      partCode: values.PartCode,
      partProcesses: dataSource.map((item) => ({
        id: item.id,
        machineId: item.machineId,
        planDate: item.planDate?.format("YYYY-MM-DD"),
        note: item.note,
      })),
    };

    console.log("Request update part:", request);

    try {
      await updatePartAsync(request);

      toast.success("Cập nhật part thành công");
      form.resetFields();
      setIsCreateNewIndex(false);
      setDataSource([createEmptyRow()]);
      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.getDisplayMessage());
        return;
      }

      toast.error("Có lỗi xảy ra.");
    }
  };

  const columns: ColumnsType<PlanRow> = [
    {
      title: "Máy",
      dataIndex: "machineId",
      key: "machineId",
      width: 180,
      render: (value: number | undefined, record) => (
        <Select
          placeholder="Chọn máy"
          style={{ width: "100%" }}
          loading={loadingMachine}
          value={value}
          options={machineOptions}
          onChange={(v: number) => handleChange(record.key, "machineId", v)}
        />
      ),
    },
    {
      title: "Ngày kế hoạch",
      dataIndex: "planDate",
      key: "planDate",
      width: 180,
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
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (value: string | undefined, record) => (
        <Input
          value={value}
          placeholder="Nhập ghi chú"
          onChange={(e) => handleChange(record.key, "note", e.target.value)}
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 90,
      align: "center",
      render: (_, record) => (
        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveRow(record.key)}
          disabled={dataSource.length === 1}
        />
      ),
    },
  ];

  return (
    <Modal
      title="Cập nhật part và progress"
      open={open}
      footer={null}
      width={1200}
      onCancel={handleCancel}
      destroyOnHidden
      confirmLoading={loadingDetail}
      styles={{
        body: {
          maxHeight: "75vh",
          overflowY: "auto",
        },
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="row g-3 m-0">
          <div className="col-4 mt-2">
            <h6 className="mb-2">Thông tin</h6>

            <Form.Item
              label="Chọn index đã có"
              name="IndexCode"
              rules={
                !isCreateNewIndex
                  ? [{ required: true, message: "Vui lòng chọn index" }]
                  : []
              }
            >
              <Select
                placeholder="Chọn index"
                disabled={isCreateNewIndex}
                loading={loadingIndexes}
                options={indexOptions}
              />
            </Form.Item>

            <Form.Item>
              <Checkbox
                checked={isCreateNewIndex}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsCreateNewIndex(checked);

                  form.setFieldsValue({
                    IndexCode: checked
                      ? undefined
                      : form.getFieldValue("IndexCode"),
                    NewIndexCode: checked
                      ? form.getFieldValue("NewIndexCode")
                      : undefined,
                  });
                }}
              >
                Tạo index mới
              </Checkbox>
            </Form.Item>

            <Form.Item
              label="Index mới"
              name="NewIndexCode"
              rules={
                isCreateNewIndex
                  ? [{ required: true, message: "Vui lòng nhập index mới" }]
                  : []
              }
            >
              <Input
                placeholder="Nhập index mới"
                disabled={!isCreateNewIndex}
              />
            </Form.Item>

            <Form.Item
              label="Part code"
              name="PartCode"
              rules={[{ required: true, message: "Vui lòng nhập part code" }]}
            >
              <Input placeholder="Nhập part code" />
            </Form.Item>
          </div>

          <div className="col-8 mt-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Kế hoạch máy</h6>

              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={handleAddRow}
              >
                Thêm dòng
              </Button>
            </div>

            <Table<PlanRow>
              rowKey="key"
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              size="small"
              bordered
              loading={loadingDetail}
              scroll={{ y: 350 }}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <Space>
            <Button onClick={handleCancel}>Đóng</Button>
            <Button type="primary" htmlType="submit" loading={loadingDetail}>
              Lưu
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}
