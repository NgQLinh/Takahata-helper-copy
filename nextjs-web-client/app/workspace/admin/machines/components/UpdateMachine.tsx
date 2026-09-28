"use client";

import { Modal, Form, Input, Select, Button, Checkbox } from "antd";
import { Machine, UpdateMachineRequest } from "@/app/types";
import { useEffect } from "react";
import {
  deleteMachineAsync,
  updateMachineAsync,
} from "@/app/services/machine/MachineService";
import { toast } from "react-toastify";
import { ApiError } from "@/app/types/common/ApiError";

type Props = {
  open: boolean;
  machine: Machine | null;
  onClose: () => void;
  onUpdate: () => void;
};

export default function UpdateMachine({
  open,
  machine,
  onClose,
  onUpdate,
}: Props) {
  const [form] = Form.useForm<Machine>();

  const isAutomatic = Form.useWatch("isAutomatic", form);

  useEffect(() => {
    if (open && machine) {
      form.setFieldsValue(machine);
    }
  }, [open, machine, form]);

  if (!machine) return null;

  const handleSubmit = async (values: Machine) => {
    const request: UpdateMachineRequest = {
      id: machine.id,
      name: values.name,
      code: values.code,
      brand: values.brand,
      type: values.type,
      isAutomatic: values.isAutomatic,
      partBitAddress: values.partBitAddress,
      partProcessBitAddress: values.partProcessBitAddress,
      statusBitAddress: values.statusBitAddress,
      processStatusBitAddress: values.processStatusBitAddress,
    };

    await updateMachineAsync(request)
      .then((data) => {
        console.log(data);
        toast.success("Cập nhật máy thành công");
        form.resetFields();
        onClose();
        onUpdate();
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

  const handleDelete = async () => {
    try {
      await deleteMachineAsync({ id: machine.id });
      toast.success("Xóa máy thành công");
    } catch (error) {
      console.error("Xóa máy không thành công:", error);
      toast.error("Xóa máy không thành công");
    } finally {
      form.resetFields();
      onClose();
      onUpdate();
    }
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
          name="isAutomatic"
          valuePropName="checked"
          initialValue={true}
        >
          <Checkbox>Máy tự đông (CNC)</Checkbox>
        </Form.Item>

        <div className="row">
          <div className="col-6">
            <Form.Item
              label="Thanh ghi trạng thái máy"
              name="statusBitAddress"
              rules={[
                {
                  required: isAutomatic,
                  message: "Vui lòng nhập thanh ghi trạng thái",
                },
              ]}
            >
              <Input
                type="number"
                allowClear
                disabled={!isAutomatic}
                placeholder="Nhập địa chỉ thanh ghi"
                autoFocus
              />
            </Form.Item>
          </div>
          <div className="col-6">
            <Form.Item
              label="Thanh ghi trạng thái gửi lệnh"
              name="processStatusBitAddress"
              rules={[
                {
                  required: isAutomatic,
                  message: "Vui lòng nhập thanh ghi trạng thái",
                },
              ]}
            >
              <Input
                type="number"
                allowClear
                disabled={!isAutomatic}
                placeholder="Nhập địa chỉ thanh ghi"
                autoFocus
              />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <Form.Item
              label="Thanh ghi part"
              name="partBitAddress"
              rules={[
                {
                  required: isAutomatic,
                  message: "Vui lòng nhập thanh ghi part",
                },
              ]}
            >
              <Input
                type="number"
                allowClear
                disabled={!isAutomatic}
                placeholder="Nhập địa chỉ thanh ghi"
                autoFocus
              />
            </Form.Item>
          </div>
          <div className="col-6">
            <Form.Item
              label="Địa chỉ thanh ghi process"
              name="partProcessBitAddress"
              rules={[
                {
                  required: isAutomatic,
                  message: "Vui lòng nhập thanh ghi process",
                },
              ]}
            >
              <Input
                type="number"
                allowClear
                disabled={!isAutomatic}
                placeholder="Nhập địa chỉ thanh ghi"
                autoFocus
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button danger onClick={handleDelete}>
            Xóa
          </Button>

          <Button onClick={handleCancel}>Hủy</Button>

          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
