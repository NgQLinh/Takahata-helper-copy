"use client";

import { Drawer, Descriptions } from "antd";
import { Machine } from "@/app/types";

type Props = {
  open: boolean;
  machine: Machine | null;
  onClose: () => void;
};

export default function MachineDetail({ open, machine, onClose }: Props) {
  return (
    <Drawer
      title="Thông tin chi tiết máy"
      placement="right"
      open={open}
      onClose={onClose}
    >
      {machine && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="ID">{machine.id}</Descriptions.Item>

          <Descriptions.Item label="Tên máy">{machine.name}</Descriptions.Item>

          <Descriptions.Item label="Mã máy">{machine.code}</Descriptions.Item>

          <Descriptions.Item label="Loại máy">{machine.type}</Descriptions.Item>

          <Descriptions.Item label="Thương hiệu">
            {machine.brand}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
}
