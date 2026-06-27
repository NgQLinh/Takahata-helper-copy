"use client";

import { Modal, Form, Input, Select, Button } from "antd";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreatePart({ open, onClose }: Props) {
  const handleCancel = () => {
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
      <div className="container">
        <div className="row">
          <div className="col-6">
            <Form>
              <Form.Item
                label="Index"
                name="IndexCode"
                rules={[
                  { required: true, message: "Vui lòng nhập index" },
                  { whitespace: true, message: "Vui lòng nhập index" },
                ]}
              >
                <Input placeholder="Nhập index" />
              </Form.Item>

              <Form.Item
                label="Part"
                name="PartCode"
                rules={[
                  { required: true, message: "Vui lòng nhập part" },
                  { whitespace: true, message: "Vui lòng nhập part" },
                ]}
              >
                <Input placeholder="Nhập part" />
              </Form.Item>
            </Form>
          </div>
          <div className="col-6" />
        </div>
        <div className="row">
          <Button onClick={handleCancel}>Đóng</Button>
        </div>
      </div>
    </Modal>
  );
}
