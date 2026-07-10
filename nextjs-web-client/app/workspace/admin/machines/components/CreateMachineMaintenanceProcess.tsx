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
import { useEffect, useState } from "react";
import { getMachinesAsync } from "@/app/services/machine/MachineService";
import { createMachineMaintenanceProcess } from "@/app/services/machine/MachineService";
import { toast } from "react-toastify";
import { Machine } from "@/app/types";

type Props = {
  open: boolean;
  onClose: () => void;
};

export type FormValues = {
  machineId: number;
  planDate: Dayjs;
  actualDate?: Dayjs;
  workingHours: number;
  performedBy?: string;
  note?: string;
  status: ProcessStatus;
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

  const [loadingMachine, setLoadingMachine] = useState(false);
  const [machines, setMachines] = useState<Machine[]>([]);

  const selectedStatus = Form.useWatch("status", form);

  const enableActualDate =
    selectedStatus === ProcessStatus.InProgress ||
    selectedStatus === ProcessStatus.Completed;

  useEffect(() => {
    const fetchMachines = async () => {
      setLoadingMachine(true);

      await getMachinesAsync()
        .then((data) => {
          setMachines(data);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách máy:", error);
        })
        .finally(() => {
          setLoadingMachine(false);
        });
    };

    if (!open) return;
    fetchMachines();
  }, [open]);

  useEffect(() => {
    if (!enableActualDate) {
      form.setFieldValue("actualDate", undefined);
    }
  }, [enableActualDate, form]);

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const request = {
      machineId: values.machineId,
      planDate: values.planDate?.format("YYYY-MM-DD") ?? null,
      actualDate: enableActualDate
        ? values.actualDate?.format("YYYY-MM-DD")
        : null,
      workingHours: values.workingHours ?? null,
      performedBy: values.performedBy ?? "",
      status: values.status ?? ProcessStatus.Planned,
      note: values.note ?? null,
    };

    console.log("Create payload:", request);

    await createMachineMaintenanceProcess(request)
      .then((data) => {
        console.log("Create response:", data);
        form.resetFields();
        onClose();
        toast.success("Quá trình bảo dưỡng máy đã được tạo thành công!");
      })
      .catch((error) => {
        toast.error(error.getDisplayMessage());
      });
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
        onFinish={handleSubmit}
        initialValues={{
          status: ProcessStatus.Planned,
        }}
      >
        <div className="row">
          <div className="col-md-6">
            <Form.Item
              label="Máy"
              name="machineId"
              rules={[{ required: true, message: "Vui lòng chọn máy" }]}
            >
              <Select
                showSearch
                placeholder="Chọn máy"
                loading={loadingMachine}
                options={machines.map((machine) => ({
                  value: machine.id,
                  label: `${machine.name} - ${machine.code}`,
                }))}
              />
            </Form.Item>
          </div>

          <div className="col-md-6">
            <Form.Item label="Trạng thái" name="status">
              <Select
                options={[
                  {
                    value: ProcessStatus.Planned,
                    label: "Đã lên kế hoạch",
                  },
                  {
                    value: ProcessStatus.InProgress,
                    label: "Đang thực hiện",
                  },
                  {
                    value: ProcessStatus.Completed,
                    label: "Hoàn thành",
                  },
                  {
                    value: ProcessStatus.Cancelled,
                    label: "Đã hủy",
                  },
                ]}
              />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form.Item
              label="Ngày kế hoạch"
              name="planDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kế hoạch" },
              ]}
            >
              <DatePicker className="w-100" format="DD/MM/YYYY" />
            </Form.Item>
          </div>

          <div className="col-md-6">
            <Form.Item
              label="Ngày thực tế"
              name="actualDate"
              rules={[
                {
                  validator: (_, value) => {
                    if (
                      enableActualDate &&
                      (value === undefined || value === null)
                    ) {
                      return Promise.reject(
                        new Error("Vui lòng chọn ngày thực tế"),
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker
                className="w-100"
                format="DD/MM/YYYY"
                disabled={!enableActualDate}
                placeholder="Chọn ngày thực tế"
              />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form.Item
              label="Số giờ làm"
              name="workingHours"
              rules={[{ required: true, message: "Vui lòng nhập số giờ làm" }]}
            >
              <InputNumber
                className="w-100"
                min={0}
                step={0.5}
                placeholder="Nhập số giờ làm"
              />
            </Form.Item>
          </div>

          <div className="col-md-6">
            <Form.Item label="Thực hiện" name="performedBy">
              <Input placeholder="Nhập tên người/đơn vị thực hiện" />
            </Form.Item>
          </div>
        </div>

        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea rows={4} placeholder="Nhập ghi chú" />
        </Form.Item>

        <div className="d-flex justify-content-end gap-2">
          <Button onClick={handleCancel}>Hủy</Button>

          <Button type="primary" htmlType="submit">
            Tạo mới
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
