"use client";

import { Modal, Form, Input, Select, Button } from "antd";
import { Machine } from "@/app/types";
import { useEffect } from "react";

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

  useEffect(() => {
    if (open && machine) {
      form.setFieldsValue(machine);
    }
  }, [open, machine, form]);

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
              { label: "NC Milling", value: "NC Milling" },
              { label: "Machining Centre", value: "Machining Centre" },
              { label: "CNC Lathe", value: "CNC Lathe" },
              { label: "Lathe (Manual)", value: "Lathe (Manual)" },
              { label: "Bench Lathe", value: "Bench Lathe" },
              { label: "EDM", value: "EDM" },
              { label: "Wire cut", value: "Wire cut" },
              { label: "Small Hole EDM", value: "Small Hole EDM" },
              { label: "Grinding", value: "Grinding" },
              { label: "Gear Hobbing MC", value: "Gear Hobbing MC" },
              { label: "Welding", value: "Welding" },
              { label: "Laser Welding", value: "Laser Welding" },
              { label: "Cleaning MC", value: "Cleaning MC" },
              { label: "Other (Manual Eqp.)", value: "Other (Manual Eqp.)" },
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
