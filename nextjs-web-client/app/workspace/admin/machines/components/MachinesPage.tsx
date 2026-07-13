"use client";

import { AppstoreOutlined, CalendarOutlined } from "@ant-design/icons";
import { Card, Space, Tabs, Typography } from "antd";
import type { TabsProps } from "antd";

import MachineListTab from "./MachineListTab";
import MaintenanceHistoryTab from "./MaintenanceHistoryTab";

import "./MachinesPage.css";

// const { Title, Text } = Typography;

export function MachinesPage() {
  const tabItems: TabsProps["items"] = [
    {
      key: "machines",
      label: (
        <Space>
          <AppstoreOutlined />
          Danh sách máy
        </Space>
      ),
      children: <MachineListTab />,
    },
    {
      key: "maintenance-history",
      label: (
        <Space>
          <CalendarOutlined />
          Lịch sử bảo dưỡng
        </Space>
      ),
      children: <MaintenanceHistoryTab />,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="machines" items={tabItems} />
    </div>
  );
}
