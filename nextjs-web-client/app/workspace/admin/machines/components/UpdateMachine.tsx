"use client";

import { Modal, Form, Input, Select, Button } from "antd";
import { Machine } from "@/app/types";

type Props = {
  open: boolean;
  machine: Machine | null;
  onClose: () => void;
  onUpdate: (request: Machine) => void | Promise<void>;
};

export default function UpdateMachine({
  open,
  machine,
  onClose,
  onUpdate,
}: Props) {
  const [form] = Form.useForm<Machine>();

  if (!machine) return null;

  const handleSubmit = async (values: Machine) => {
    await onUpdate({
      ...machine,
      ...values,
    });
    form.resetFields();
    onClose();
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Sửa thông tin máy"
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnHidden
    >
      <Form<Machine>
        key={machine.id}
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={machine}
      >
        <Form.Item
          label="Tên máy"
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên máy" },
            { whitespace: true, message: "Vui lòng nhập tên máy" },
          ]}
        >
          <Input placeholder="Nhập tên máy" />
        </Form.Item>
        <Form.Item
          label="Mã máy"
          name="code"
          rules={[
            { required: true, message: "Vui lòng nhập mã máy" },
            { whitespace: true, message: "Vui lòng nhập mã máy" },
          ]}
        >
          <Input placeholder="Nhập mã máy" />
        </Form.Item>

        <Form.Item
          label="Loại máy"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại máy" }]}
        >
          <Select
            options={[
              { label: "CNC", value: "CNC" },
              { label: "EMD", value: "EMD" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Thương hiệu"
          name="brand"
          rules={[
            { required: true, message: "Vui lòng nhập thương hiệu máy" },
            { whitespace: true, message: "Vui lòng nhập thương hiệu máy" },
          ]}
        >
          <Input placeholder="Nhập thương hiệu máy" />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={handleCancel}>Hủy</Button>

          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
