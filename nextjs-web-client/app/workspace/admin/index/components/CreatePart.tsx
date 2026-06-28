"use client";

import { useState } from "react";
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

type Props = {
  open: boolean;
  onClose: () => void;
};

type PlanRow = {
  key: string;
  machine?: string;
  planDate?: Dayjs | null;
  note?: string;
};

const machineOptions = [
  { label: "Máy 1", value: "M01" },
  { label: "Máy 2", value: "M02" },
  { label: "Máy 3", value: "M03" },
];

const createEmptyRow = (): PlanRow => ({
  key: crypto.randomUUID(),
  machine: undefined,
  planDate: null,
  note: "",
});

export default function CreatePart({ open, onClose }: Props) {
  const [form] = Form.useForm();

  const [isCreateNewIndex, setIsCreateNewIndex] = useState(false);

  const [dataSource, setDataSource] = useState<PlanRow[]>([
    {
      key: crypto.randomUUID(),
      machine: "M01",
      planDate: dayjs(),
      note: "",
    },
  ]);

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

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const payload = {
      ...values,
      schedules: dataSource.map((item) => ({
        machine: item.machine,
        planDate: item.planDate?.format("YYYY-MM-DD"),
        note: item.note,
      })),
    };

    console.log("Payload submit:", payload);
  };

  const columns: ColumnsType<PlanRow> = [
    {
      title: "Máy",
      dataIndex: "machine",
      key: "machine",
      width: 180,
      render: (value: string | undefined, record) => (
        <Select
          placeholder="Chọn máy"
          style={{ width: "100%" }}
          value={value}
          options={machineOptions}
          onChange={(v) => handleChange(record.key, "machine", v)}
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
      width: 100,
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
      title="Thêm mới part và progress"
      open={open}
      footer={null}
      width={1100}
      height={800}
      onCancel={handleCancel}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="row">
          <div className="col-4 justify-content-between align-items-center mt-2">
            <h6 className="mb-2">Thông tin</h6>
            <Form.Item label="Chọn index đã có" name="IndexCode">
              <Select
                placeholder="Chọn index"
                disabled={isCreateNewIndex}
                options={[
                  { label: "INDEX_001", value: "INDEX_001" },
                  { label: "INDEX_002", value: "INDEX_002" },
                ]}
              />
            </Form.Item>

            <Form.Item>
              <Checkbox
                checked={isCreateNewIndex}
                onChange={(e) => {
                  const checked = e.target.checked;

                  setIsCreateNewIndex(checked);

                  if (checked) {
                    form.setFieldValue("IndexCode", undefined);
                  } else {
                    form.setFieldValue("NewIndexCode", undefined);
                  }
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
              label="Part name"
              name="PartName"
              rules={[{ required: true, message: "Vui lòng nhập part name" }]}
            >
              <Input placeholder="Nhập part name" />
            </Form.Item>
          </div>

          <div className="col-8">
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
              scroll={{ y: 350 }}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <Space>
            <Button onClick={handleCancel}>Đóng</Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}
