"use client";

import { useEffect, useState } from "react";
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
  updateSettingsAsync,
} from "@/app/services/settings/SettingsService";

const { Text } = Typography;

const SETTINGS_STORAGE_KEY = "application-system-settings";

interface SettingsFormValues {
  ipAddress: string;
  port: number;
}

const DEFAULT_SETTINGS: SettingsFormValues = {
  ipAddress: "127.0.0.1",
  port: 5000,
};

const IPV4_PATTERN =
  /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

export default function SettingsTab() {
  const [form] = Form.useForm<SettingsFormValues>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

      if (!storedSettings) {
        form.setFieldsValue(DEFAULT_SETTINGS);
        return;
      }

      const parsedSettings = JSON.parse(
        storedSettings,
      ) as Partial<SettingsFormValues>;

      form.setFieldsValue({
        ...DEFAULT_SETTINGS,
        ...parsedSettings,
      });
    } catch (error) {
      console.error("Không thể đọc cấu hình:", error);

      form.setFieldsValue(DEFAULT_SETTINGS);
      toast.error("Không thể đọc cấu hình đã lưu");
    } finally {
      setLoading(false);
    }
  }, [form]);

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
      console.error("Lỗi khi tạo Part:", error);

      if (error instanceof ApiError) {
        toast.error(error.getDisplayMessage());
        return;
      }

      toast.error("Có lỗi xảy ra khi tạo Part.");
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {};

  return (
    <div className="settings-tab">
      <Form<SettingsFormValues>
        form={form}
        layout="vertical"
        initialValues={DEFAULT_SETTINGS}
        disabled={loading}
        onFinish={handleSave}
        onValuesChange={() => setHasChanges(true)}
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
                tooltip="Địa chỉ IPv4 của máy chủ cung cấp API"
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
                tooltip="Port mà máy chủ đang lắng nghe"
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

        <Card className="mt-3" size="small" title="Lưu ý">
          <Text type="secondary">
            Sau khi thay đổi IP hoặc Port, các yêu cầu tiếp theo của ứng dụng
            cần sử dụng địa chỉ máy chủ mới. Hãy bảo đảm máy chủ có thể truy cập
            từ thiết bị đang sử dụng.
          </Text>
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
            disabled={!hasChanges}
          >
            Lưu cài đặt
          </Button>
        </div>
      </Form>
    </div>
  );
}
