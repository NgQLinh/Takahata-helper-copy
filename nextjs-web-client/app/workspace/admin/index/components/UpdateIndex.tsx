"use client";

import { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { toast } from "react-toastify";

import { Index } from "@/app/types";
import { updateIndexAsync } from "@/app/services/index/IndexService";
import { ApiError } from "@/app/types/common/ApiError";

type Props = {
  index?: Index | null;
  open: boolean;
  onClose: () => void;
};

const FORM_ID = "update-index-form";

export default function UpdateIndex({ index, open, onClose }: Props) {
  const [form] = Form.useForm<Index>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && index) {
      form.setFieldsValue({
        id: index.id,
        code: index.code,
      });
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  const handleCancel = () => {
    if (submitting) return;

    form.resetFields();
    onClose();
  };

  const handleSubmit = async (values: Index) => {
    if (!index) return;

    try {
      setSubmitting(true);

      await updateIndexAsync({
        id: index.id,
        code: values.code,
      });

      toast.success("Cập nhật index thành công");

      form.resetFields();
      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.getDisplayMessage());
        return;
      }

      toast.error("Cập nhật index thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Sửa thông tin Index"
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnHidden
      closable={!submitting}
      keyboard={!submitting}
    >
      <Form<Index>
        id={FORM_ID}
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="Mã Index"
          name="code"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mã index",
            },
            {
              whitespace: true,
              message: "Vui lòng nhập mã index",
            },
          ]}
        >
          <Input placeholder="Nhập mã index" maxLength={100} />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={handleCancel} disabled={submitting}>
            Hủy
          </Button>

          <Button type="primary" htmlType="submit" loading={submitting}>
            Lưu
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
