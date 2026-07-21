"use client";

import { AppstoreOutlined, CalendarOutlined } from "@ant-design/icons";
import { Space, Tabs } from "antd";
import type { TabsProps } from "antd";

import PartProcessingScheduleTab from "./PartProcessingScheduleTab";
import "./IndexPage.css";
import IndexListTab from "./IndexListTab";
import { useState } from "react";

export function IndexPage() {
  const [activeKey, setActiveKey] = useState("1");

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <Space>
          <AppstoreOutlined />
          Part và kế hoạch gia công
        </Space>
      ),
      children: <PartProcessingScheduleTab active={activeKey === "1"} />,
    },
    {
      key: "2",
      label: (
        <Space>
          <CalendarOutlined />
          Danh sách index
        </Space>
      ),
      children: <IndexListTab  active={activeKey === "2"}  />,
    },
  ];

  return (
    <div className="schedule-page">
      <Tabs
        onChange={(key) => setActiveKey(key)}
        defaultActiveKey="part"
        items={tabItems}
      />
    </div>
  );
}
