"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Checkbox,
  Table,
  DatePicker,
  Space,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { Index, Machine } from "@/app/types";
import { getMachinesAsync } from "@/app/services/machine/MachineService";
import {
  createPartAsync,
  getIndexesAsync,
} from "@/app/services/index/IndexService";
import { toast } from "react-toastify";
import { ApiError } from "@/app/types/common/ApiError";

type Props = {
  open: boolean;
  onClose: () => void;
};

type PlanRow = {
  key: string;
  machineId?: string;
  planDate?: Dayjs | null;
  note?: string;
};

type FormValues = {
  IndexCode?: string;
  NewIndexCode?: string;
  PartCode: string;
};

const createEmptyRow = (): PlanRow => ({
  key: crypto.randomUUID(),
  machineId: undefined,
  planDate: null,
  note: "",
});

export default function CreatePart({ open, onClose }: Props) {
  const [form] = Form.useForm<FormValues>();

  const [loadingMachine, setLoadingMachine] = useState(false);
  const [loadingIndexes, setLoadingIndexes] = useState(false);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [indexes, setIndexes] = useState<Index[]>([]);
  const [isCreateNewIndex, setIsCreateNewIndex] = useState(false);
  const [dataSource, setDataSource] = useState<PlanRow[]>([
    {
      key: crypto.randomUUID(),
      machineId: undefined,
      planDate: dayjs(),
      note: "",
    },
  ]);

  useEffect(() => {
    const fetchIndexes = async () => {
      setLoadingIndexes(true);

      await getIndexesAsync()
        .then((data) => {
          setIndexes(data);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách indexes:", error);
        })
        .finally(() => {
          setLoadingIndexes(false);
        });
    };

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

    fetchIndexes();
    fetchMachines();
  }, []);

  const machineOptions = useMemo(
    () =>
      machines.map((machine) => ({
        label: `${machine.name} - ${machine.code}`,
        value: machine.id,
      })),
    [machines],
  );

  const indexOptions = useMemo(
    () =>
      indexes.map((index) => ({
        label: index.code,
        value: index.code,
      })),
    [indexes],
  );

  const handleCancel = () => {
    form.resetFields();
    setIsCreateNewIndex(false);
    setDataSource([createEmptyRow()]);
    onClose();
  };

  const handleChange = <K extends keyof PlanRow>(
    key: string,
    field: K,
    value: PlanRow[K],
  ) => {
    setDataSource((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleAddRow = () => {
    setDataSource((prev) => [...prev, createEmptyRow()]);
  };

  const handleRemoveRow = (key: string) => {
    setDataSource((prev) => prev.filter((item) => item.key !== key));
  };

  const handleSubmit = async (values: FormValues) => {
    const request = {
      indexCode: values.IndexCode ?? values.NewIndexCode,
      partCode: values.PartCode,
      partProcesses: dataSource.map((item) => ({
        machineId: item.machineId,
        planDate: item.planDate?.format("YYYY-MM-DD"),
        note: item.note,
      })),
    };

    console.log("Payload submit:", request);

    await createPartAsync(request)
      .then((data) => {
        console.log(data);
        toast.success("Tạo part thành công");
        form.resetFields();
        onClose();
      })
      .catch((error) => {
        if (error instanceof ApiError) {
          toast.error(error.getDisplayMessage());
          return;
        }
        toast.error("Có lỗi xảy ra.");
      });
  };

  const columns: ColumnsType<PlanRow> = [
    {
      title: "Máy",
      dataIndex: "machine",
      key: "machine",
      width: 180,
      render: (value: string | undefined, record) => (
        <Select
          placeholder="Chọn máy"
          style={{ width: "100%" }}
          loading={loadingMachine}
          value={value}
          options={machineOptions}
          onChange={(v: string) => handleChange(record.key, "machineId", v)}
        />
      ),
    },
    {
      title: "Ngày kế hoạch",
      dataIndex: "planDate",
      key: "planDate",
      width: 180,
      render: (value: Dayjs | null | undefined, record) => (
        <DatePicker
          placeholder="Chọn ngày"
          style={{ width: "100%" }}
          value={value}
          format="DD/MM/YYYY"
          onChange={(date) => handleChange(record.key, "planDate", date)}
        />
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (value: string | undefined, record) => (
        <Input
          value={value}
          placeholder="Nhập ghi chú"
          onChange={(e) => handleChange(record.key, "note", e.target.value)}
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 90,
      align: "center",
      render: (_, record) => (
        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveRow(record.key)}
          disabled={dataSource.length === 1}
        />
      ),
    },
  ];

  return (
    <Modal
      title="Thêm mới part và progress"
      open={open}
      footer={null}
      width={1200}
      onCancel={handleCancel}
      destroyOnHidden
      styles={{
        body: {
          maxHeight: "75vh",
          overflowY: "auto",
        },
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="row g-3 m-0">
          <div className="col-4 mt-2">
            <h6 className="mb-2">Thông tin</h6>

            <Form.Item label="Chọn index đã có" name="IndexCode">
              <Select
                placeholder="Chọn index"
                disabled={isCreateNewIndex}
                loading={loadingIndexes}
                options={indexOptions}
              />
            </Form.Item>

            <Form.Item>
              <Checkbox
                checked={isCreateNewIndex}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsCreateNewIndex(checked);

                  form.setFieldsValue({
                    IndexCode: checked
                      ? undefined
                      : form.getFieldValue("IndexCode"),
                    NewIndexCode: checked
                      ? form.getFieldValue("NewIndexCode")
                      : undefined,
                  });
                }}
              >
                Tạo index mới
              </Checkbox>
            </Form.Item>

            <Form.Item
              label="Index mới"
              name="NewIndexCode"
              rules={
                isCreateNewIndex
                  ? [{ required: true, message: "Vui lòng nhập index mới" }]
                  : []
              }
            >
              <Input
                placeholder="Nhập index mới"
                disabled={!isCreateNewIndex}
              />
            </Form.Item>

            <Form.Item
              label="Part code"
              name="PartCode"
              rules={[{ required: true, message: "Vui lòng nhập part name" }]}
            >
              <Input placeholder="Nhập part name" />
            </Form.Item>
          </div>

          <div className="col-8 mt-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Kế hoạch máy</h6>

              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={handleAddRow}
              >
                Thêm dòng
              </Button>
            </div>

            <Table<PlanRow>
              rowKey="key"
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              size="small"
              bordered
              scroll={{ y: 350 }}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <Space>
            <Button onClick={handleCancel}>Đóng</Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}
