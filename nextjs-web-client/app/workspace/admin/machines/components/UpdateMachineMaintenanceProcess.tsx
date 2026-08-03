import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import type { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import {
  deleteMachineMaintenanceProcessAsync,
  getMachineMaintenanceProcessAsync,
  getMachinesAsync,
  updateMachineMaintenanceProcess,
} from "@/app/services/machine/MachineService";
import { Machine } from "@/app/types";
import { toast } from "react-toastify";
import dayjs from "dayjs";

type Props = {
  id?: number | null;
  open: boolean;
  onClose: () => void;
};

export type FormValues = {
  id: number;
  machineId: number;
  plantDate: Dayjs;
  startTime?: Dayjs | null;
  endTime?: Dayjs | null;
  performedBy?: string | null;
  note?: string | null;
  status: ProcessStatus | ProcessStatus.Planned;
};

enum ProcessStatus {
  Planned = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3,
}

export default function UpdateMachineMaintenanceProcess({
  id,
  open,
  onClose,
}: Props) {
  const [form] = Form.useForm<FormValues>();

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingMachine, setLoadingMachine] = useState(false);
  const [machines, setMachines] = useState<Machine[]>([]);

  const selectedStatus = Form.useWatch("status", form);

  const enableInputTime =
    selectedStatus === ProcessStatus.InProgress ||
    selectedStatus === ProcessStatus.Completed;

  const fetchMachines = useCallback(async () => {
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
  }, []);

  const fetchDetail = useCallback(
    async (id: number) => {
      setLoadingDetail(true);

      try {
        const data = await getMachineMaintenanceProcessAsync({ id });

        form.setFieldsValue({
          machineId: data.machineId,
          plantDate: data.plantDate ? dayjs(data.plantDate) : undefined,
          startTime: data.startTime ? dayjs(data.startTime) : null,
          endTime: data.startTime ? dayjs(data.startTime) : null,
          performedBy: data.performedBy,
          status: data.status | ProcessStatus.Planned,
          note: data.note,
        });
      } catch (error) {
        console.error("Lỗi khi lấy chi kế hoạch bảo trì:", error);
        toast.error("Không lấy được chi tiết kế hoạch bảo trì.");
      } finally {
        setLoadingDetail(false);
      }
    },
    [form],
  );

  useEffect(() => {
    const run = async () => {
      await fetchMachines();

      if (id) {
        await fetchDetail(id);
      }
    };

    if (!open) return;
    run();
  }, [fetchDetail, fetchMachines, id, open]);

  useEffect(() => {
    if (!enableInputTime) {
      form.setFieldValue("startTime", undefined);
    }
  }, [enableInputTime, form]);

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleDelete = async () => {
    try {
      await deleteMachineMaintenanceProcessAsync({ id: id });
      toast.success("Xóa lịch bảo dưỡng thành công");
    } catch (error) {
      console.error("Xóa lịch bảo dưỡng không thành công:", error);
      toast.error("Xóa lịch bảo dưỡng không thành công");
    } finally {
      form.resetFields();
      onClose();
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const request = {
      id: id,
      machineId: values.machineId,
      plantDate: values.plantDate?.format("YYYY-MM-DD") ?? null,
      startTime: values.startTime?.format("YYYY-MM-DDTHH:mm:ssZ"),
      endTime: values.endTime?.format("YYYY-MM-DDTHH:mm:ssZ"),
      performedBy: values.performedBy ?? "",
      status: values.status ?? ProcessStatus.Planned,
      note: values.note ?? null,
    };

    console.log("Create payload:", request);

    await updateMachineMaintenanceProcess(request)
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
      title="Cập nhật quá trình bảo dưỡng máy"
      open={open}
      footer={null}
      confirmLoading={loadingDetail}
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
              name="plantDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kế hoạch" },
              ]}
            >
              <DatePicker className="w-100" format="DD/MM/YYYY" />
            </Form.Item>
          </div>

          <div className="col-md-6">
            <Form.Item label="Thực hiện" name="performedBy">
              <Input placeholder="Nhập tên người/đơn vị thực hiện" />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form.Item
              label="Bắt đầu"
              name="startTime"
              rules={[
                {
                  validator: (_, value) => {
                    if (
                      enableInputTime &&
                      (value === undefined || value === null)
                    ) {
                      return Promise.reject(
                        new Error("Vui lòng chọn thời gian."),
                      );
                    } else {
                      const startTime = form.getFieldValue("startTime");
                      const endTime = form.getFieldValue("endTime");

                      if (startTime && endTime && startTime.isAfter(endTime)) {
                        return Promise.reject(
                          new Error("Thời gian bắt đầu phải lớn hơn kết thúc."),
                        );
                      }
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker
                className="w-100"
                showTime={{
                  format: "HH:mm",
                }}
                format="DD/MM/YYYY HH:mm"
                disabled={!enableInputTime}
                placeholder="Nhập ngày, giờ."
              />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              label="Hoàn thành"
              name="endTime"
              rules={[
                {
                  validator: (_, value) => {
                    if (
                      enableInputTime &&
                      (value === undefined || value === null)
                    ) {
                      return Promise.reject(
                        new Error(
                          "Vui lòng chọn thời gian hoàn thành công việc",
                        ),
                      );
                    } else {
                      const startTime = form.getFieldValue("startTime");
                      const endTime = form.getFieldValue("endTime");

                      if (startTime && endTime && startTime.isAfter(endTime)) {
                        return Promise.reject(
                          new Error("Thời gian bắt đầu phải lớn hơn kết thúc."),
                        );
                      }
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker
                className="w-100"
                showTime={{
                  format: "HH:mm",
                }}
                format="DD/MM/YYYY HH:mm"
                disabled={!enableInputTime}
                placeholder="Nhập ngày, giờ."
              />
            </Form.Item>
          </div>
        </div>

        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea rows={4} placeholder="Nhập ghi chú" />
        </Form.Item>

        <div className="d-flex justify-content-end gap-2">
          <Button danger onClick={handleDelete}>
            Xóa
          </Button>
          <Button onClick={handleCancel}>Hủy</Button>

          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
