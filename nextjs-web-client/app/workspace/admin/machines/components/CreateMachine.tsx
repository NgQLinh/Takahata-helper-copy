"use client";

import { CreateMachineRequest } from "@/app/types";
import { Modal, Form, Input, Select, Button } from "antd";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (request: CreateMachineRequest) => void | Promise<void>;
};

const initialValues: CreateMachineRequest = {
  name: "",
  code: "",
  brand: "",
  type: "",
  bitAddress: 0,
};

export default function CreateMachine({ open, onClose, onCreate }: Props) {
  const [form] = Form.useForm<CreateMachineRequest>();

  const handleSubmit = async (values: CreateMachineRequest) => {
    await onCreate(values);
    form.resetFields();
    onClose();
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Thêm máy"
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnHidden
    >
      <Form<CreateMachineRequest>
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
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
