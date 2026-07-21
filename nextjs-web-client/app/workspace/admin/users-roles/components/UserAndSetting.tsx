"use client";

import { Space, Tabs } from "antd";
import type { TabsProps } from "antd";
import SettingsTab from "./SettingsTab";
import UserListTab from "./UserListTab";
import { SettingOutlined, TeamOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function UserAndSetting() {
  const [activeKey, setActiveKey] = useState("1");

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <Space>
          <TeamOutlined />
          Người dùng & phân quyền
        </Space>
      ),
      children: <UserListTab />,
    },
    {
      key: "2",
      label: (
        <Space>
          <SettingOutlined />
          Cài đặt
        </Space>
      ),
      children: <SettingsTab />,
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
