"use client";

import {
  AppstoreOutlined,
  CalendarOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { Card, Space, Tabs, Typography } from "antd";
import type { TabsProps } from "antd";

import PartProcessingScheduleTab from "./PartProcessingScheduleTab";
import "./IndexPage.css";

const { Title } = Typography;

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
      children: <div>Danh sách index</div>,
    },
  ];

  return (
    <div className="schedule-page">
      <Card>
        <div className="schedule-header">
          <div className="schedule-title-wrap">
            <div className="schedule-icon">
              <ScheduleOutlined />
            </div>

            <div>
              <Title level={3} className="schedule-title">
                Lịch trình gia công chi tiết khuôn
              </Title>
              <Typography.Text type="secondary">
                Theo dõi kế hoạch, thực tế gia công và trạng thái máy theo từng
                part.
              </Typography.Text>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultActiveKey="part" items={tabItems} />
    </div>
  );
}
