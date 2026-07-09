import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import type { Dayjs } from "dayjs";

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  machineId?: number;
  planDate?: Dayjs;
  actualDate?: Dayjs;
  workingHours?: number;
  performedBy?: string;
  status?: ProcessStatus;
  note?: string;
};

enum ProcessStatus {
  Planned = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3,
}

export default function CreateMachineMaintenanceProcess({
  open,
  onClose,
}: Props) {
  const [form] = Form.useForm<FormValues>();

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const payload = {
      machineId: values.machineId,
      planDate: values.planDate?.format("YYYY-MM-DD") ?? null,
      actualDate: values.actualDate?.format("YYYY-MM-DD") ?? null,
      workingHours: values.workingHours ?? null,
      performedBy: values.performedBy ?? "",
      status: values.status ?? ProcessStatus.Planned,
      note: values.note ?? "",
    };

    console.log("Create payload:", payload);

    // TODO: gọi API tạo maintenance process ở đây
    // await createMachineMaintenanceProcess(payload);

    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Thêm mới quá trình bảo dưỡng máy"
      open={open}
      footer={null}
      onCancel={handleCancel}
      destroyOnHidden
      styles={{
        body: {
          maxHeight: "75vh",
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: ProcessStatus.Planned,
        }}
      >
        <div className="row">
          <Form.Item
            className="col-md-6"
            label="Máy"
            name="machineId"
            rules={[{ required: true, message: "Vui lòng chọn máy" }]}
          >
            <Select
              showSearch
              placeholder="Chọn máy"
              options={[
                { value: 1, label: "Máy CNC 01" },
                { value: 2, label: "Máy CNC 02" },
                { value: 3, label: "Máy tiện 01" },
              ]}
            />
          </Form.Item>

          <div className="col-md-6">
            <Form.Item label="Ngày kế hoạch" name="planDate">
              <DatePicker className="w-100" format="DD/MM/YYYY" />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form.Item label="Số giờ làm" name="workingHours">
              <InputNumber
                className="w-100"
                min={0}
                step={0.5}
                placeholder="Nhập số giờ làm"
              />
            </Form.Item>
          </div>

          <div className="col-md-6">
            <Form.Item label="Trạng thái" name="status">
              <Select
                options={[
                  { value: ProcessStatus.Planned, label: "Đã lên kế hoạch" },
                  { value: ProcessStatus.InProgress, label: "Đang thực hiện" },
                  { value: ProcessStatus.Completed, label: "Hoàn thành" },
                  { value: ProcessStatus.Cancelled, label: "Đã hủy" },
                ]}
              />
            </Form.Item>
          </div>
        </div>

        <Form.Item label="Người thực hiện" name="performedBy">
          <Input placeholder="Nhập tên người thực hiện" />
        </Form.Item>

        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea rows={4} placeholder="Nhập ghi chú" />
        </Form.Item>

        <div className="d-flex justify-content-end gap-2">
          <Button onClick={handleCancel}>Hủy</Button>

          <Button type="primary" onClick={handleSubmit}>
            Tạo mới
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
