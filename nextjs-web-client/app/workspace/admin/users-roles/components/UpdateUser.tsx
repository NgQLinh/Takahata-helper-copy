"use client";

import { Modal, Form, Input, Select, Button } from "antd";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Account } from "@/app/types/account/Account";
import { getMachinesAsync } from "@/app/services/machine/MachineService";
import { useEffect, useState } from "react";
import { Machine } from "@/app/types";

type Props = {
  open: boolean;
  user: Account | null;
  onClose: () => void;
  onUpdate: (user: Account) => void | Promise<void>;
};

const validationSchema = Yup.object({
  userName: Yup.string().trim().required("Vui lòng nhập tên đăng nhập"),

  fullName: Yup.string().trim().required("Vui lòng nhập họ và tên"),

  password: Yup.string().matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'"\\|,.<>/?]).{8,}$/,
    {
      message:
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
      excludeEmptyString: true,
    },
  ),

  role: Yup.string().oneOf(["ADMIN", "USER"]).required("Vui lòng chọn vai trò"),
});

export default function UpdateUser({ open, user, onClose, onUpdate }: Props) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loadingMachines, setLoadingMachines] = useState(false);

  useEffect(() => {
    if (!open || !user) return;

    const loadMachines = async () => {
      try {
        setLoadingMachines(true);

        const result = await getMachinesAsync();

        setMachines(result);
      } catch (error) {
        console.error("Không thể tải danh sách máy", error);
      } finally {
        setLoadingMachines(false);
      }
    };

    loadMachines();
  }, [open, user]);

  if (!user) return null;

  const handleSubmit = async (
    values: Account,
    helpers: FormikHelpers<Account>,
  ) => {
    try {
      await onUpdate(values);
      onClose();
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <Formik<Account>
      initialValues={{
        ...user,
        password: user.password ?? "",
        machineIds:
          user.machineIds ?? user.machines?.map((machine) => machine.id) ?? [],
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        handleSubmit,
        handleChange,
        handleBlur,
        setFieldValue,
        resetForm,
      }) => (
        <Modal
          title="Cập nhật người dùng"
          open={open}
          onCancel={() => {
            resetForm();
            onClose();
          }}
          footer={null}
          destroyOnHidden
        >
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Tên đăng nhập"
              validateStatus={
                touched.userName && errors.userName ? "error" : ""
              }
              help={touched.userName && errors.userName}
            >
              <Input
                name="userName"
                value={values.userName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={user.isDefaultAccount}
              />
            </Form.Item>

            <Form.Item
              label="Họ và tên"
              validateStatus={
                touched.fullName && errors.fullName ? "error" : ""
              }
              help={touched.fullName && errors.fullName}
            >
              <Input
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                disabled={user.isDefaultAccount}
                onBlur={handleBlur}
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              validateStatus={
                touched.password && errors.password ? "error" : ""
              }
              help={touched.password && errors.password}
            >
              <Input.Password
                name="password"
                placeholder="Nhập mật khẩu"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Item>

            <Form.Item
              label="Vai trò"
              validateStatus={touched.role && errors.role ? "error" : ""}
              help={touched.role && errors.role}
            >
              <Select
                disabled={user.isDefaultAccount}
                value={values.role}
                onChange={(value) => setFieldValue("role", value)}
                onBlur={() => setFieldValue("role", values.role)}
                options={[
                  { label: "ADMIN", value: "ADMIN" },
                  { label: "USER", value: "USER" },
                ]}
              />
            </Form.Item>

            {values.role === "USER" && (
              <Form.Item
                label="Máy được phân quyền"
                validateStatus={
                  touched.machineIds && errors.machineIds ? "error" : ""
                }
                help={
                  touched.machineIds && typeof errors.machineIds === "string"
                    ? errors.machineIds
                    : undefined
                }
              >
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="Chọn máy được phân quyền"
                  loading={loadingMachines}
                  value={values.machineIds}
                  onChange={(machineIds: number[]) => {
                    setFieldValue("machineIds", machineIds);
                  }}
                  options={machines.map((machine) => ({
                    label: machine.name,
                    value: machine.id,
                  }))}
                />
              </Form.Item>
            )}

            <div className="flex justify-end gap-2">
              <Button
                htmlType="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              >
                Hủy
              </Button>

              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Cập nhật
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </Formik>
  );
}
