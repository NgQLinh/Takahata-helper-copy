"use client";

import { createMachineAsync } from "@/app/services/machine/MachineService";
import { CreateMachineRequest } from "@/app/types";
import { ApiError } from "@/app/types/common/ApiError";
import { Modal, Form, Input, Select, Button } from "antd";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
};

const initialValues: CreateMachineRequest = {
  name: "",
  code: "",
  brand: "",
  type: "",
  partBitAddress: null,
  partProcessBitAddress: null,
  statusBitAddress: null,
};

export default function CreateMachine({ open, onClose, onCreate }: Props) {
  const [form] = Form.useForm<CreateMachineRequest>();

  const handleSubmit = async (values: CreateMachineRequest) => {
    await createMachineAsync(values)
      .then(async (data) => {
        console.log(data);
        toast.success("Tạo máy thành công");
        form.resetFields();
        onClose();
        onCreate();
      })
      .catch((error) => {
        if (error instanceof ApiError) {
          toast.error(error.getDisplayMessage());
          return;
        }
        toast.error("Có lỗi xảy ra.");
      });
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
        <div className="row">
          <div className="col-6">
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
          </div>

          <div className="col-6">
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
          </div>
        </div>

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

        <Form.Item
          label="Thanh ghi trạng thái"
          name="statusBitAddress"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập thanh ghi trạng thái",
            },
          ]}
        >
          <Input
            type="number"
            allowClear
            placeholder="Nhập địa chỉ thanh ghi"
            autoFocus
          />
        </Form.Item>

        <div className="row">
          <div className="col-6">
            <Form.Item
              label="Thanh ghi part"
              name="partBitAddress"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thanh ghi part",
                },
              ]}
            >
              <Input
                type="number"
                allowClear
                placeholder="Nhập địa chỉ thanh ghi"
                autoFocus
              />
            </Form.Item>
          </div>
          <div className="col-6">
            <Form.Item
              label="Thanh ghi process"
              name="partProcessBitAddress"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thanh ghi process",
                },
              ]}
            >
              <Input
                type="number"
                allowClear
                placeholder="Nhập địa chỉ thanh ghi"
                autoFocus
              />
            </Form.Item>
          </div>
        </div>

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
