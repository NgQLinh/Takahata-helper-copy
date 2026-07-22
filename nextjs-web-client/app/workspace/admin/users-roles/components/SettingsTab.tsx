"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Space,
  Typography,
} from "antd";
import {
  ApiOutlined,
  GlobalOutlined,
  SaveOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { ApiError } from "@/app/types/common/ApiError";
import {
  getSettingsAsync,
  testConnectionAsync,
  updateSettingsAsync,
} from "@/app/services/settings/SettingsService";

interface SettingsFormValues {
  ipAddress: string;
  port: number;
}

interface Props {
  active: boolean;
}

const DEFAULT_SETTINGS: SettingsFormValues = {
  ipAddress: "192.168.3.250",
  port: 502,
};

const IPV4_PATTERN =
  /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

export default function SettingsTab({ active }: Props) {
  const [form] = Form.useForm<SettingsFormValues>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSettingsAsync();

      form.setFieldValue("ipAddress", data.ipAddress);
      form.setFieldValue("port", data.port);
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy thông tin settings:", error);

      if (error instanceof ApiError) {
        toast.error(error.getDisplayMessage());
        return;
      }

      toast.error("Có lỗi xảy ra khi lấy thông tin settings.");
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    const run = async () => {
      await fetchSettings();
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const handleSave = async (values: SettingsFormValues) => {
    const request = {
      ipAddress: values.ipAddress,
      port: values.port,
    };

    setSaving(true);

    try {
      await updateSettingsAsync(request);
      toast.success("Tạo Part thành công.");

      const data = await getSettingsAsync();

      console.log(data);
    } catch (error) {
      console.error("Lỗi khi update settings:", error);

      if (error instanceof ApiError) {
        toast.error(error.getDisplayMessage());
        return;
      }

      toast.error("Có lỗi xảy ra khi update settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      await testConnectionAsync();
      toast.success("Success.");
    } catch (error) {
      console.error("Connect failure:", error);

      if (error instanceof ApiError) {
        toast.error(error.getDisplayMessage());
        return;
      }

      toast.error("Connect failure.");
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="settings-tab">
      <Form<SettingsFormValues>
        form={form}
        layout="vertical"
        initialValues={DEFAULT_SETTINGS}
        disabled={loading}
        onFinish={handleSave}
      >
        <Card
          title={
            <Space>
              <GlobalOutlined />
              Thông tin PLC
            </Space>
          }
        >
          <div className="row">
            <div className="col-12 col-lg-6">
              <Form.Item
                label="Địa chỉ IP"
                name="ipAddress"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địa chỉ IP",
                  },
                  {
                    pattern: IPV4_PATTERN,
                    message: "Địa chỉ IPv4 không hợp lệ",
                  },
                ]}
              >
                <Input
                  prefix={<GlobalOutlined />}
                  placeholder="Ví dụ: 192.168.1.100"
                  maxLength={15}
                />
              </Form.Item>
            </div>

            <div className="col-12 col-lg-6">
              <Form.Item
                label="Port"
                name="port"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập port",
                  },
                  {
                    type: "number",
                    min: 1,
                    max: 65535,
                    message: "Port phải nằm trong khoảng 1 đến 65535",
                  },
                ]}
              >
                <InputNumber
                  className="w-100"
                  min={1}
                  max={65535}
                  precision={0}
                  placeholder="Ví dụ: 5000"
                  prefix={<ApiOutlined />}
                />
              </Form.Item>
            </div>
          </div>

          <Divider />
        </Card>

        <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap mt-3">
          <Button
            icon={<WifiOutlined />}
            loading={testingConnection}
            onClick={handleTestConnection}
          >
            Kiểm tra kết nối
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={saving}
          >
            Lưu cài đặt
          </Button>
        </div>
      </Form>
    </div>
  );
}
