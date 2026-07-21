"use client";

import { AppstoreOutlined, CalendarOutlined } from "@ant-design/icons";
import { Space, Tabs } from "antd";
import type { TabsProps } from "antd";

import PartProcessingScheduleTab from "./PartProcessingScheduleTab";
import "./IndexPage.css";
import IndexListTab from "./IndexListTab";

export function IndexPage() {
  const tabItems: TabsProps["items"] = [
    {
      key: "part",
      label: (
        <Space>
          <AppstoreOutlined />
          Part và kế hoạch gia công
        </Space>
      ),
      children: <PartProcessingScheduleTab />,
    },
    {
      key: "index",
      label: (
        <Space>
          <CalendarOutlined />
          Danh sách index
        </Space>
      ),
      children: <IndexListTab />,
    },
  ];

  return (
    <div className="schedule-page">
      <Tabs defaultActiveKey="part" items={tabItems} />
    </div>
  );
}
