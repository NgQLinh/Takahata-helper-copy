"use client";

import { useState } from "react";
import { Modal, Form, Input, Select, Button, Checkbox } from "antd";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreatePart({ open, onClose }: Props) {
  const [form] = Form.useForm();
  const [isCreateNewIndex, setIsCreateNewIndex] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    setIsCreateNewIndex(false);
    onClose();
  };

  return (
    <Modal
      title="Thêm mới part và progress"
      open={open}
      footer={null}
      onCancel={handleCancel}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
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
          <Input placeholder="Nhập index mới" disabled={!isCreateNewIndex} />
        </Form.Item>

        <Form.Item
          label="Part name"
          name="PartName"
          rules={[{ required: true, message: "Vui lòng nhập part name" }]}
        >
          <Input placeholder="Nhập part name" />
        </Form.Item>

        <div className="d-flex justify-content-end gap-2">
          <Button onClick={handleCancel}>Đóng</Button>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
