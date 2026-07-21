"use client";

import { AppstoreOutlined, CalendarOutlined } from "@ant-design/icons";
import { Space, Tabs } from "antd";
import type { TabsProps } from "antd";

import MachineListTab from "./MachineListTab";
import MaintenanceHistoryTab from "./MaintenanceHistoryTab";
import { useState } from "react";

export function MachinesPage() {
  const [activeKey, setActiveKey] = useState("1");

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <Space>
          <AppstoreOutlined />
          Danh sách máy
        </Space>
      ),
      children: <MachineListTab active={activeKey === "1"} />,
    },
    {
      key: "2",
      label: (
        <Space>
          <CalendarOutlined />
          Lịch sử bảo dưỡng
        </Space>
      ),
      children: <MaintenanceHistoryTab active={activeKey === "2"} />,
    },
  ];

  return (
    <div>
      <Tabs
        onChange={(key) => setActiveKey(key)}
        defaultActiveKey="machines"
        items={tabItems}
      />
    </div>
  );
}
