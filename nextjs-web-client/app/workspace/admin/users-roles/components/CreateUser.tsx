"use client";

import { CreateAccountRequest, Machine } from "@/app/types";
import { Modal, Form, Input, Select, Button } from "antd";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { getMachinesAsync } from "@/app/services/machine/MachineService";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (user: CreateAccountRequest) => void | Promise<void>;
};

const initialValues: CreateAccountRequest = {
  userName: "",
  fullName: "",
  password: "",
  role: "USER",
  machineIds: [],
};

const validationSchema = Yup.object({
  userName: Yup.string().trim().required("Vui lòng nhập tên đăng nhập"),

  fullName: Yup.string().trim().required("Vui lòng nhập họ và tên"),

  password: Yup.string()
    .required("Vui lòng nhập mật khẩu")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'"\\|,.<>/?]).{8,}$/,
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    ),

  role: Yup.string().oneOf(["ADMIN", "USER"]).required("Vui lòng chọn vai trò"),

  machineIds: Yup.array()
    .of(Yup.string())
    .min(1, "Vui lòng chọn ít nhất một máy"),
});

export default function CreateUser({ open, onClose, onCreate }: Props) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loadingMachines, setLoadingMachines] = useState(false);

  useEffect(() => {
    if (!open) return;

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
  }, [open]);

  const handleSubmitForm = async (
    values: CreateAccountRequest,
    helpers: FormikHelpers<CreateAccountRequest>,
  ) => {
    try {
      console.log("Create user request:", values);

      await onCreate(values);

      helpers.resetForm();
      onClose();
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        handleSubmit,
        setFieldValue,
        handleChange,
        handleBlur,
        resetForm,
      }) => (
        <Modal
          title="Thêm người dùng"
          open={open}
          onCancel={() => {
            resetForm();
            onClose();
          }}
          footer={null}
          destroyOnHidden
        >
          <Form layout="vertical" onFinish={() => handleSubmit()}>
            <Form.Item
              label="Tên đăng nhập"
              validateStatus={
                touched.userName && errors.userName ? "error" : ""
              }
              help={touched.userName && errors.userName}
            >
              <Input
                name="userName"
                placeholder="Nhập tên đăng nhập"
                value={values.userName}
                onChange={handleChange}
                onBlur={handleBlur}
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
                placeholder="Nhập họ và tên"
                value={values.fullName}
                onChange={handleChange}
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
                value={values.role}
                onChange={(value) => setFieldValue("role", value)}
                options={[
                  {
                    label: "ADMIN",
                    value: "ADMIN",
                  },
                  {
                    label: "USER",
                    value: "USER",
                  },
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
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              >
                Hủy
              </Button>

              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Lưu
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </Formik>
  );
}
