"use client";

import { Modal, Button } from "antd";

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
      <div>
        <Button onClick={handleCancel}>Đóng</Button>
      </div>
    </Modal>
  );
}
