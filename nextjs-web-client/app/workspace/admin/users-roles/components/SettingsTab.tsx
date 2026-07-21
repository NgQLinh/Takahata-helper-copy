"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Space,
  Switch,
  Typography,
} from "antd";
import {
  ApiOutlined,
  GlobalOutlined,
  ReloadOutlined,
  SaveOutlined,
  SettingOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

const { Text, Title } = Typography;

const SETTINGS_STORAGE_KEY = "application-system-settings";

interface SettingsFormValues {
  serverIp: string;
  serverPort: number;
  apiBasePath: string;
  useHttps: boolean;
  timeoutSeconds: number;
}

const DEFAULT_SETTINGS: SettingsFormValues = {
  serverIp: "127.0.0.1",
  serverPort: 5000,
  apiBasePath: "/api",
  useHttps: false,
  timeoutSeconds: 30,
};

const IPV4_PATTERN =
  /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

export default function SettingsTab() {
  const [form] = Form.useForm<SettingsFormValues>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const useHttps = Form.useWatch("useHttps", form);
  const serverIp = Form.useWatch("serverIp", form);
  const serverPort = Form.useWatch("serverPort", form);
  const apiBasePath = Form.useWatch("apiBasePath", form);

  const connectionUrl = useMemo(() => {
    const protocol = useHttps ? "https" : "http";
    const ip = serverIp?.trim() || DEFAULT_SETTINGS.serverIp;
    const port = serverPort || DEFAULT_SETTINGS.serverPort;

    let basePath = apiBasePath?.trim() || "";

    if (basePath && !basePath.startsWith("/")) {
      basePath = `/${basePath}`;
    }

    return `${protocol}://${ip}:${port}${basePath}`;
  }, [useHttps, serverIp, serverPort, apiBasePath]);

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
    try {
      setSaving(true);

      const normalizedSettings: SettingsFormValues = {
        ...values,
        serverIp: values.serverIp.trim(),
        apiBasePath: normalizeBasePath(values.apiBasePath),
      };

      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(normalizedSettings),
      );

      form.setFieldsValue(normalizedSettings);
      setHasChanges(false);

      toast.success("Lưu cài đặt thành công");
    } catch (error) {
      console.error("Không thể lưu cấu hình:", error);
      toast.error("Lưu cài đặt không thành công");
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreDefault = () => {
    form.setFieldsValue(DEFAULT_SETTINGS);
    setHasChanges(true);
  };

  const handleTestConnection = async () => {
    try {
      const values = await form.validateFields();

      setTestingConnection(true);

      const protocol = values.useHttps ? "https" : "http";
      const basePath = normalizeBasePath(values.apiBasePath);
      const url = `${protocol}://${values.serverIp}:${values.serverPort}${basePath}`;

      const controller = new AbortController();

      const timeoutId = window.setTimeout(() => {
        controller.abort();
      }, values.timeoutSeconds * 1000);

      try {
        await fetch(url, {
          method: "GET",
          signal: controller.signal,
        });

        toast.success("Kết nối đến máy chủ thành công");
      } finally {
        window.clearTimeout(timeoutId);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        toast.error("Kết nối quá thời gian chờ");
      } else {
        console.error("Kiểm tra kết nối thất bại:", error);
        toast.error("Không thể kết nối đến máy chủ");
      }
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="settings-tab">
      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
        <div>
          <Title level={4} className="mb-1">
            <SettingOutlined className="me-2" />
            Cài đặt hệ thống
          </Title>

          <Text type="secondary">
            Cấu hình địa chỉ máy chủ và các tham số kết nối của ứng dụng.
          </Text>
        </div>

        {hasChanges && (
          <Alert type="warning" showIcon message="Có thay đổi chưa được lưu" />
        )}
      </div>

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
              Thông tin máy chủ
            </Space>
          }
        >
          <div className="row">
            <div className="col-12 col-lg-6">
              <Form.Item
                label="Địa chỉ IP"
                name="serverIp"
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
                name="serverPort"
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

            <div className="col-12 col-lg-6">
              <Form.Item
                label="Đường dẫn API"
                name="apiBasePath"
                tooltip="Đường dẫn cơ sở được thêm sau IP và Port"
                rules={[
                  {
                    max: 200,
                    message: "Đường dẫn API không được vượt quá 200 ký tự",
                  },
                ]}
              >
                <Input prefix={<ApiOutlined />} placeholder="Ví dụ: /api" />
              </Form.Item>
            </div>

            <div className="col-12 col-lg-3">
              <Form.Item
                label="Thời gian chờ"
                name="timeoutSeconds"
                tooltip="Thời gian tối đa chờ phản hồi từ máy chủ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập thời gian chờ",
                  },
                  {
                    type: "number",
                    min: 1,
                    max: 300,
                    message: "Thời gian chờ từ 1 đến 300 giây",
                  },
                ]}
              >
                <InputNumber
                  className="w-100"
                  min={1}
                  max={300}
                  precision={0}
                  addonAfter="giây"
                />
              </Form.Item>
            </div>

            <div className="col-12 col-lg-3">
              <Form.Item
                label="Sử dụng HTTPS"
                name="useHttps"
                valuePropName="checked"
              >
                <Switch checkedChildren="HTTPS" unCheckedChildren="HTTP" />
              </Form.Item>
            </div>
          </div>

          <Divider />

          <div>
            <Text type="secondary">Địa chỉ kết nối hiện tại</Text>

            <Input
              className="mt-2"
              value={connectionUrl}
              readOnly
              prefix={<WifiOutlined />}
            />
          </div>
        </Card>

        <Card className="mt-3" size="small" title="Lưu ý">
          <Text type="secondary">
            Sau khi thay đổi IP hoặc Port, các yêu cầu tiếp theo của ứng dụng
            cần sử dụng địa chỉ máy chủ mới. Hãy bảo đảm máy chủ có thể truy cập
            từ thiết bị đang sử dụng.
          </Text>
        </Card>

        <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap mt-3">
          <Button icon={<ReloadOutlined />} onClick={handleRestoreDefault}>
            Khôi phục mặc định
          </Button>

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

function normalizeBasePath(basePath?: string) {
  const value = basePath?.trim() || "";

  if (!value) {
    return "";
  }

  return value.startsWith("/") ? value : `/${value}`;
}
